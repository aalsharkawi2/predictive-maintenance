import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'react-native';
import useSystemUI from '@/hooks/useSystemUI';
import { router, useLocalSearchParams } from 'expo-router';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  SnapbackZoom,
  ResumableZoom,
  CropZoom,
  type CropZoomRefType,
} from 'react-native-zoom-toolkit';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  X,
  Scissors,
  RotateCcw,
  Check,
  FlipHorizontal,
} from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import {
  setLastPhoto,
  setShouldCloseCameraOnce,
  setDevicePhoto,
} from '@/store/photoSlice';
import { DeviceType } from '@/types/maintenance';

type AssetLike = { id: string; uri: string; width: number; height: number };

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function ImageEditorModal() {
  useSystemUI('hidden');
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const params = useLocalSearchParams<{
    uri?: string;
    width?: string;
    height?: string;
    assetId?: string;
    source?: 'camera' | 'gallery';
    deviceType?: DeviceType | string;
  }>();

  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [loading, setLoading] = useState<boolean>(false);
  const [container, setContainer] = useState<{ w: number; h: number }>({
    w: Dimensions.get('window').width,
    h: Dimensions.get('window').height,
  });
  const [headerH, setHeaderH] = useState(0);
  const [toolbarH, setToolbarH] = useState(0);
  const cropRef = useRef<CropZoomRefType>(null);
  // Modes: 'crop' default, 'zoom' optional; when none selected, fall back to snap view
  const [mode, setMode] = useState<'zoom' | 'crop' | undefined>('crop');
  const [flipH, setFlipH] = useState(false);

  const initialItem = useMemo<AssetLike | undefined>(() => {
    if (params.uri && params.width && params.height) {
      return {
        id: params.assetId ?? params.uri,
        uri: params.uri,
        width: Number(params.width),
        height: Number(params.height),
      };
    }
    return undefined;
  }, [params]);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, [permission]);

  const onRotate = (clockwise = true) => {
    cropRef.current?.rotate?.(true, clockwise);
  };

  const onKeepOriginal = async () => {
    try {
      // If crop is available, perform crop like the Crop button.
      if (cropRef.current?.crop) {
        await onCrop();
        return;
      }
      // Fallback: keep original if crop not available
      const item = initialItem;
      if (!item) return;
      const kept = {
        uri: item.uri,
        width: item.width,
        height: item.height,
        createdAt: Date.now(),
      } as any;
      dispatch(setLastPhoto(kept));
      if (params.deviceType) {
        dispatch(
          setDevicePhoto({ deviceType: params.deviceType as any, photo: kept }),
        );
      }
      if (params.source === 'camera') {
        dispatch(setShouldCloseCameraOnce(true));
        (router.dismiss as any)(2);
      } else {
        router.back();
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to keep original image');
    }
  };

  const onCrop = async () => {
    try {
      if (!cropRef.current) return;
      setLoading(true);
      const state = cropRef.current.crop?.();
      if (!state) return;
      const item = initialItem;
      // Apply crop + optional resize + rotation/flip using expo-image-manipulator
      const actions: ImageManipulator.Action[] = [];
      // apply rotate if any
      const angle = Math.round(state.context.rotationAngle);
      if (angle % 360 !== 0) actions.push({ rotate: angle });
      // apply flips (include local flipH state)
      if (flipH || state.context.flipHorizontal)
        actions.push({ flip: ImageManipulator.FlipType.Horizontal });
      if (state.context.flipVertical)
        actions.push({ flip: ImageManipulator.FlipType.Vertical });
      // crop rect
      actions.push({
        crop: {
          originX: state.crop.originX,
          originY: state.crop.originY,
          width: state.crop.width,
          height: state.crop.height,
        },
      });
      // resize if provided
      if (state.resize)
        actions.push({
          resize: { width: state.resize.width, height: state.resize.height },
        });

      if (!item) return;
      const result = await ImageManipulator.manipulateAsync(item.uri, actions, {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      // save cropped result for thumbnail/edit and close modal(s) to preserve state
      const cropped = {
        uri: result.uri,
        width: (result as any).width ?? state.crop.width,
        height: (result as any).height ?? state.crop.height,
        createdAt: Date.now(),
      };
      dispatch(setLastPhoto(cropped as any));
      if (params.deviceType) {
        dispatch(
          setDevicePhoto({
            deviceType: params.deviceType as DeviceType,
            photo: cropped as any,
          }),
        );
      }
      setLoading(false);
      if (params.source === 'camera') {
        // Signal camera modal to auto-close when it regains focus
        dispatch(setShouldCloseCameraOnce(true));
        // Close the editor and the underlying camera modal in one go
        (router.dismiss as any)(2);
      } else {
        // Just close the editor and reveal devices
        router.back();
      }
      return;
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to crop image');
    } finally {
      setLoading(false);
    }
  };

  const item = initialItem;
  // Stage uses full height; header and footer overlay on top so image is visible under them
  const stageH = Math.max(0, container.h);
  const fitContain = (
    srcW: number,
    srcH: number,
    maxW: number,
    maxH: number,
  ) => {
    const ratio = Math.min(maxW / srcW, maxH / srcH);
    return {
      width: Math.floor(srcW * ratio),
      height: Math.floor(srcH * ratio),
    };
  };
  const fitCover = (srcW: number, srcH: number, maxW: number, maxH: number) => {
    const ratio = Math.max(maxW / srcW, maxH / srcH);
    return {
      width: Math.floor(srcW * ratio),
      height: Math.floor(srcH * ratio),
    };
  };
  const display = item
    ? fitContain(item.width, item.height, container.w, stageH)
    : { width: container.w, height: stageH };
  const cropSize = { width: display.width, height: display.height };
  const cover = item
    ? fitCover(item.width, item.height, container.w, stageH)
    : { width: container.w, height: stageH };

  return (
    <View style={styles.root}>
      {/* System UI hidden via useSystemUI('hidden') */}
      <SafeAreaView
        style={styles.header}
        onLayout={(e) => setHeaderH(e.nativeEvent.layout.height)}
      >
        <View
          style={[
            styles.headerBar,
            mode !== 'crop' && styles.headerBarTransparent,
          ]}
        >
          <View style={styles.topControls}>
            <View style={styles.leftRow}>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => router.back()}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                accessibilityLabel="إغلاق"
              >
                <X color="#ffffff" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modeRow}>
              <ModeButton
                label="Zoom"
                active={mode === 'zoom'}
                onPress={() =>
                  setMode((m) => (m === 'zoom' ? undefined : 'zoom'))
                }
              />
              <ModeButton
                label="Crop"
                active={mode === 'crop'}
                onPress={() =>
                  setMode((m) => (m === 'crop' ? undefined : 'crop'))
                }
              />
            </View>

            <View style={styles.leftRow}>
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={onKeepOriginal}
                hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                accessibilityLabel="اعتماد الصورة كما هي"
              >
                <Check color="#ffffff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <View
        style={styles.content}
        onLayout={(e) =>
          setContainer({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })
        }
      >
        {!item ? (
          <View style={styles.center}>
            <ActivityIndicator color="#fff" />
          </View>
        ) : mode === 'crop' ? (
          <View style={{ flex: 1 }}>
            <View
              style={[styles.stage, { width: container.w, height: stageH }]}
            >
              <CropZoom
                ref={cropRef}
                cropSize={cropSize}
                resolution={{ width: item.width, height: item.height }}
                minScale={1}
                allowPinchPanning
                OverlayComponent={() => (
                  <RuleOfThirdsOverlay
                    width={cropSize.width}
                    height={cropSize.height}
                  />
                )}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: [{ scaleX: flipH ? -1 : 1 }],
                  }}
                />
              </CropZoom>

              {/* Dark overlays inside the crop view wrapper (don’t cover buttons) */}
              <View
                style={[
                  styles.darkOverlay,
                  {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: Math.max(0, (stageH - cropSize.height) / 2),
                  },
                ]}
                pointerEvents="none"
              />
              <View
                style={[
                  styles.darkOverlay,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: Math.max(0, (stageH - cropSize.height) / 2),
                  },
                ]}
                pointerEvents="none"
              />
              <View
                style={[
                  styles.darkOverlay,
                  {
                    position: 'absolute',
                    left: 0,
                    width: Math.max(0, (container.w - cropSize.width) / 2),
                    top: Math.max(0, (stageH - cropSize.height) / 2),
                    height: cropSize.height,
                  },
                ]}
                pointerEvents="none"
              />
              <View
                style={[
                  styles.darkOverlay,
                  {
                    position: 'absolute',
                    right: 0,
                    width: Math.max(0, (container.w - cropSize.width) / 2),
                    top: Math.max(0, (stageH - cropSize.height) / 2),
                    height: cropSize.height,
                  },
                ]}
                pointerEvents="none"
              />
            </View>

            <View style={[styles.toolbarBar]}>
              <View style={styles.toolbar}>
                <ToolbarButton
                  icon={<RotateCcw color="#fff" size={20} />}
                  label="Rotate"
                  onPress={() => onRotate(true)}
                />
                <ToolbarButton
                  icon={<FlipHorizontal color="#fff" size={20} />}
                  label="Flip"
                  onPress={() => setFlipH((v) => !v)}
                />
              </View>
            </View>
          </View>
        ) : mode === 'zoom' ? (
          <View style={styles.flexCenter}>
            <View
              style={[
                styles.stage,
                {
                  width: container.w,
                  height: stageH,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <ResumableZoom minScale={1} maxScale={6}>
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: cropSize.width,
                    height: cropSize.height,
                    transform: [{ scaleX: flipH ? -1 : 1 }],
                  }}
                />
              </ResumableZoom>
            </View>
          </View>
        ) : (
          // Default snapback (no UI shown)
          <View style={styles.flexCenter}>
            <View
              style={[
                styles.stage,
                {
                  width: container.w,
                  height: stageH,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <SnapbackZoom
                resizeConfig={{
                  size: { width: cropSize.width, height: cropSize.height },
                  aspectRatio: (item.width || 1) / (item.height || 1),
                  scale: 1,
                }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: cropSize.width,
                    height: cropSize.height,
                    transform: [{ scaleX: flipH ? -1 : 1 }],
                  }}
                />
              </SnapbackZoom>
            </View>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      )}
    </View>
  );
}

function ModeButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.modeBtn, active && styles.modeBtnActive]}
    >
      <Text style={[styles.modeText, active && styles.modeTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function ToolbarButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.toolBtn}>
      {icon}
      <Text style={styles.toolText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingHorizontal: 12,
    paddingTop: 8,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 5,
  },
  headerBar: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 6,
  },
  headerBarTransparent: {
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonTransparent: {
    backgroundColor: 'transparent',
  },
  modeRow: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  modeBtnActive: { backgroundColor: '#fff' },
  modeText: { color: '#fff', fontFamily: 'Cairo-Regular' },
  modeTextActive: { color: '#000', fontFamily: 'Cairo-Bold' },
  content: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: SCREEN_W, height: SCREEN_W },
  flexCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  darkOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  stage: {
    overflow: 'hidden',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingBottom: 80,
  },
  toolbarBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 20,
  },
  toolText: { color: '#fff', fontFamily: 'Cairo-Bold' },
  footerSpace: { height: 84 },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

function RuleOfThirdsOverlay({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const lineStyle = {
    backgroundColor: 'rgba(255,255,255,0.7)',
    position: 'absolute' as const,
  };
  const thickness = 1;
  return (
    <View style={{ width, height }} pointerEvents="none">
      {/* Border frame */}
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: thickness,
          },
          { backgroundColor: 'rgba(255,255,255,0.9)' },
        ]}
      />
      <View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: thickness,
          },
          { backgroundColor: 'rgba(255,255,255,0.9)' },
        ]}
      />
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: thickness,
          },
          { backgroundColor: 'rgba(255,255,255,0.9)' },
        ]}
      />
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: thickness,
          },
          { backgroundColor: 'rgba(255,255,255,0.9)' },
        ]}
      />

      {/* Vertical lines at 1/3 and 2/3 */}
      <View
        style={[lineStyle, { width: thickness, height, left: width / 3 }]}
      />
      <View
        style={[lineStyle, { width: thickness, height, left: (2 * width) / 3 }]}
      />
      {/* Horizontal lines at 1/3 and 2/3 */}
      <View
        style={[lineStyle, { height: thickness, width, top: height / 3 }]}
      />
      <View
        style={[lineStyle, { height: thickness, width, top: (2 * height) / 3 }]}
      />
    </View>
  );
}
