import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
  StatusBar,
  AppState,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLastPhoto,
  setShouldCloseCameraOnce,
  setDevicePhoto,
} from '@/store/photoSlice';
import { RootState } from '@/store';
import { DeviceType } from '@/types/maintenance';

import useSystemUI from '@/hooks/useSystemUI';

import { X, Image as ImageIcon, Flashlight } from 'lucide-react-native';
import { shadowStyles } from '@/styles/common';

export default function CameraScreen() {
  useSystemUI('hidden');
  const params = useLocalSearchParams<{ deviceType?: DeviceType | string }>();

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [freezeUri, setFreezeUri] = useState<string | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const freezeOpacity = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);
  const navigatedRef = useRef(false);
  const dispatch = useDispatch();
  const shouldCloseCameraOnce = useSelector(
    (s: RootState) => s.photo.shouldCloseCameraOnce,
  );

  useFocusEffect(
    React.useCallback(() => {
      // reset guard on focus so user can navigate again next time
      navigatedRef.current = false;
      setIsCapturing(false);
      setFreezeUri(null);
      freezeOpacity.setValue(0);
      // If editor signaled to close camera after finishing crop, close now
      if (shouldCloseCameraOnce) {
        dispatch(setShouldCloseCameraOnce(false));
        // Close this modal to reveal Devices
        setTimeout(() => router.back(), 0);
      }
      return () => {};
    }, [shouldCloseCameraOnce]),
  );

  useEffect(() => {
    if (freezeUri) {
      freezeOpacity.setValue(0);
      Animated.timing(freezeOpacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [freezeUri]);

  // Function to pick an image from the gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        if (navigatedRef.current) return;
        navigatedRef.current = true;
        const asset = result.assets[0];
        (router.push as any)({
          pathname: '/(modals)/image-editor',
          params: {
            uri: asset.uri,
            width: asset.width,
            height: asset.height,
            source: 'gallery',
            deviceType: (params.deviceType as DeviceType) ?? undefined,
          },
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
    }
  };

  // Function to capture a photo
  const takePicture = async () => {
    if (isCapturing) return;

    try {
      setIsCapturing(true);

      if (!cameraRef.current) {
        throw new Error('Camera ref is null');
      }

      // Trigger a quick shutter flash for immediate user feedback
      setShutterFlash(true);
      setTimeout(() => setShutterFlash(false), 120);

      // Capture quickly and then overlay a freeze-frame so feed appears inactive
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
      if (!photo) throw new Error('Failed to take picture');

      // Freeze the current view by overlaying the captured frame
      setFreezeUri(photo.uri);

      // Save photo info in Redux for thumbnail and re-edit
      dispatch(
        setLastPhoto({
          uri: photo.uri,
          width: photo.width ?? 0,
          height: photo.height ?? 0,
          createdAt: Date.now(),
        }),
      );
      // Also associate per device type if provided via route params
      const dt = (params.deviceType as DeviceType) ?? undefined;
      if (dt) {
        dispatch(
          setDevicePhoto({
            deviceType: dt,
            photo: {
              uri: photo.uri,
              width: photo.width ?? 0,
              height: photo.height ?? 0,
              createdAt: Date.now(),
            },
          }),
        );
      }
      // Flag is set by editor when cropping completes; no need to set it here

      // Navigate immediately to the editor with the captured uri
      if (!navigatedRef.current) {
        navigatedRef.current = true;
        (router.push as any)({
          pathname: '/(modals)/image-editor',
          params: {
            uri: photo.uri,
            width: photo.width ?? 0,
            height: photo.height ?? 0,
            source: 'camera',
            deviceType: (params.deviceType as DeviceType) ?? undefined,
          },
        });
      }

      // Optionally save to media library in the background (non-blocking)
      try {
        if (mediaLibraryPermission?.granted) {
          await MediaLibrary.createAssetAsync(photo.uri);
        }
      } catch (e) {
        // Non-fatal, don't block navigation
        console.warn('Background save failed:', e);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التقاط الصورة');
    } finally {
      // Keep UI responsive; the feed remains visible under the incoming editor modal
      setIsCapturing(false);
    }
  };

  // Toggle flash mode
  const toggleFlash = () => {
    setFlash(!flash);
  };

  // Removed front/back toggle per requirements

  // Handle permission requests
  const handlePermissions = async () => {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }

    if (!mediaLibraryPermission?.granted) {
      await requestMediaLibraryPermission();
    }
  };

  // Handle the case when permissions are denied
  const handlePermissionDenied = () => {
    Alert.alert(
      'الأذونات مطلوبة',
      'تحتاج التطبيق إلى الوصول إلى الكاميرا ومكتبة الوسائط لالتقاط وحفظ الصور.',
      [
        { text: 'إلغاء', onPress: () => router.back(), style: 'cancel' },
        {
          text: 'فتح الإعدادات',
          onPress: () => {
            router.back();
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ],
    );
  };

  // Check if permissions are still being determined
  if (cameraPermission === undefined || mediaLibraryPermission === undefined) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.permissionText}>جاري التحقق من الأذونات...</Text>
      </View>
    );
  }

  // Check if permissions are denied
  if (
    cameraPermission === null ||
    mediaLibraryPermission === null ||
    !cameraPermission.granted ||
    !mediaLibraryPermission.granted
  ) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          لم يتم منح إذن الوصول إلى الكاميرا أو مكتبة الوسائط
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handlePermissions}
        >
          <Text style={styles.permissionButtonText}>منح الأذونات</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={handlePermissionDenied}
        >
          <Text style={styles.permissionButtonText}>فتح الإعدادات</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.permissionButton, { backgroundColor: '#6b7280' }]}
          onPress={() => router.back()}
        >
          <Text style={styles.permissionButtonText}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        enableTorch={flash}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityLabel="إغلاق"
            >
              <X color="#ffffff" size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconButton, flash && styles.activeIconButton]}
              onPress={toggleFlash}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityLabel="تبديل الفلاش"
            >
              <Flashlight color="#ffffff" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={isCapturing ? undefined : pickImage}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              accessibilityLabel="اختيار من المعرض"
            >
              <ImageIcon color="#ffffff" size={30} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isCapturing}
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              accessibilityLabel="التقاط صورة"
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color="#ffffff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <View style={{ width: 50 }} />
          </View>
        </SafeAreaView>
      </CameraView>
      {/* Overlays: blocker, freeze-frame (fade-in), and tiny capturing toast */}
      {isCapturing && <View style={styles.blocker} pointerEvents="auto" />}
      {freezeUri && (
        <Animated.Image
          source={{ uri: freezeUri }}
          style={[StyleSheet.absoluteFillObject, { opacity: freezeOpacity }]}
          resizeMode="cover"
          accessibilityLabel="freeze-frame"
        />
      )}
      {isCapturing && (
        <View style={styles.centerToast} pointerEvents="none">
          <ActivityIndicator color="#fff" size="small" />
          <Text style={styles.centerToastText}>Capturing…</Text>
        </View>
      )}
      {shutterFlash && (
        <View style={styles.shutterFlash} pointerEvents="none" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconButton: {
    backgroundColor: 'rgba(37, 99, 235, 0.6)',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 80,
  },
  blocker: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  centerToast: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -60 }, { translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerToastText: {
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'Cairo-Bold',
  },
  shutterFlash: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.2,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyles.button,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Cairo-Regular',
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
  },
});
