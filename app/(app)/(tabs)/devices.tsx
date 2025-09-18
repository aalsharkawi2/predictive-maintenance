import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Modal,
  Linking,
} from 'react-native';
import { Camera, CheckCheck, CheckCircle2, Pencil } from 'lucide-react-native';
import { useMaintenanceState } from '@/hooks/useMaintenanceState';
import { TypeSelector } from '@/components/TypeSelector';
import { ActionCheckItem } from '@/components/ActionCheckItem';
import { NoteItem } from '@/components/NoteItem';
import { Identifier } from '@/components/Identifier';
import { MaintenanceType } from '@/types/maintenance';
import { shadowStyles } from '@/styles/common';
import { AddNote } from '@/components/AddNote';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';

export default function DevicesScreen() {
  const {
    state,
    maintenanceTypes,
    deviceTypes,
    setColumnType,
    setColumnNum,
    setArea,
    setDeviceNum,
    setDeviceId,
    setMaintenanceType,
    setDeviceType,
    toggleAction,
    setDeviceNote,
    deleteNote,
    setPhoto,
  } = useMaintenanceState();

  const identifierHelperFn = {
    setColumnType,
    setColumnNum,
    setArea,
    setDeviceNum,
    setDeviceId,
  };

  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);

  const checkAndRequestPermissions = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      const hasPermissions =
        cameraPermission.status === 'granted' &&
        mediaLibraryPermission.status === 'granted';

      if (hasPermissions) {
        router.push('/camera');
      } else {
        setPermissionDialogVisible(true);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التحقق من الأذونات');
    }
  };

  // Handle opening device settings
  const handleOpenSettings = () => {
    setPermissionDialogVisible(false);
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  // Open the image editor with the existing photo
  const handleEditPhoto = () => {
    if (!state.photo) return;
    /*
    router.push({
      pathname: '/image-editor',
      params: {
        uri: state.photo.editedUri || state.photo.uri,
        assetId: state.photo.assetId,
        width: state.photo.width?.toString(),
        height: state.photo.height?.toString(),
        source: state.photo.source,
      },
    });
*/
  };

  const isAllActionsChecked = () => {
    if (!state.selectedDeviceType) {
      return;
    }
    return (
      state.deviceActions[state.selectedDeviceType].filter(
        (action) => action.isSelected === true,
      ).length === state.deviceActions[state.selectedDeviceType].length
    );
  };

  const isAnyActionChecked = () => {
    const flagArray = deviceTypes.map(
      (type) =>
        state.deviceActions[type].filter((action) => action.isSelected === true)
          .length >= 1,
    );
    return flagArray.filter((flag) => flag === true).length;
  };
  const renderIdentifier = (type: MaintenanceType) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>معرف ال{type}</Text>
      <Identifier
        type={type}
        state={state}
        identifierHelperFn={identifierHelperFn}
      />
    </View>
  );

  const renderActionsList = () => {
    let deviceType;
    if (!state.deviceId) {
      deviceType = null;
    } else {
      deviceType = state.selectedDeviceType;
    }
    if (!deviceType) return null;

    const actions = state.deviceActions[deviceType];
    const notes = state.deviceNotes[deviceType];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
        <View style={styles.checklist}>
          <View style={styles.checkAllContainer}>
            <ActionCheckItem
              label={'اختيار الكل'}
              isSelected={false}
              onToggle={() => {
                state.deviceActions[deviceType].filter(
                  (action, index) =>
                    !action.isSelected && toggleAction(deviceType, index),
                );
                if (isAllActionsChecked()) {
                  state.deviceActions[deviceType].map((action, index) =>
                    toggleAction(deviceType, index),
                  );
                }
              }}
              Icon={CheckCheck}
              TextStyle={styles.checkAllText}
            />
          </View>
          {actions.map((actionItem, index) => (
            <ActionCheckItem
              key={`${deviceType}-${index}`}
              label={actionItem.action}
              isSelected={actionItem.isSelected}
              onToggle={() => toggleAction(deviceType, index)}
              Icon={CheckCircle2}
              TextStyle={styles.checkText}
            />
          ))}
          {notes.map(
            (note) =>
              state.selectedDeviceType && (
                <NoteItem
                  note={note}
                  onDelete={() => deleteNote(deviceType, note)}
                ></NoteItem>
              ),
          )}
        </View>
        <AddNote
          deviceType={deviceType}
          setDeviceNote={setDeviceNote}
          scrollViewRef={scrollViewRef}
          scrollYRef={scrollYRef}
        ></AddNote>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Maintenance Type Selector */}
          <TypeSelector
            title="نوع الصيانة"
            options={maintenanceTypes}
            selectedOption={state.selectedMaintenanceType}
            onSelect={(type) => {
              setMaintenanceType(type);
              setDeviceId('');
            }}
          />

          {/* Identifier Input */}
          {state.selectedMaintenanceType !== null &&
            renderIdentifier(state.selectedMaintenanceType)}

          {/* Device Type Selector (Only for 'جهاز' maintenance type) */}
          {state.selectedMaintenanceType === 'جهاز' && !!state.deviceId && (
            <TypeSelector
              title="نوع المكون"
              options={deviceTypes}
              selectedOption={state.selectedDeviceType}
              onSelect={(type) => setDeviceType(type)}
            />
          )}

          {/* Actions Checklist */}
          {state.selectedMaintenanceType === 'جهاز'
            ? state.selectedDeviceType !== null && renderActionsList()
            : state.selectedMaintenanceType !== null && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
                  <TextInput
                    style={shadowStyles.input}
                    placeholder="placeholder"
                    textAlign="right"
                    accessibilityLabel="الإجراءات المتخذة"
                  />
                </View>
              )}
          <View style={styles.flexSpacer} />
          <View style={styles.section}>
            {/* Camera Button and Photo Thumbnail */}
            {!!state.deviceId && (
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity
                  style={[
                    isAnyActionChecked()
                      ? styles.genericButton
                      : styles.genericDisabledButton,
                  ]}
                  onPress={checkAndRequestPermissions}
                  disabled={!isAnyActionChecked()}
                  accessibilityRole="button"
                  accessibilityLabel="التقاط صورة"
                >
                  <Camera size={24} color="#ffffff" />
                  <Text style={styles.photoButtonText}>التقاط صورة</Text>
                </TouchableOpacity>
                {state.photo && (
                  <TouchableOpacity
                    style={styles.thumbnailContainer}
                    onPress={handleEditPhoto}
                    accessibilityLabel="تعديل الصورة"
                  >
                    <Image
                      source={{ uri: state.photo.editedUri || state.photo.uri }}
                      style={styles.thumbnail}
                    />
                    <View style={styles.editIconContainer}>
                      <Pencil size={12} color="#ffffff" />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              accessibilityRole="button"
              accessibilityLabel="حفظ وإنهاء"
            >
              <Text style={styles.submitButtonText}>حفظ وإنهاء</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Permissions Dialog */}
      <Modal
        visible={permissionDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPermissionDialogVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.permissionDialog}>
            <Text style={styles.permissionTitle}>الأذونات مطلوبة</Text>
            <Text style={styles.permissionText}>
              يحتاج التطبيق إلى إذن الوصول إلى الكاميرا ومكتبة الوسائط لالتقاط
              وحفظ الصور.
            </Text>
            <View style={styles.permissionButtons}>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={handleOpenSettings}
              >
                <Text style={styles.permissionButtonText}>فتح الإعدادات</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.permissionButton,
                  { backgroundColor: '#6b7280' },
                ]}
                onPress={() => setPermissionDialogVisible(false)}
              >
                <Text style={styles.permissionButtonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
    flexGrow: 1,
  },
  flexSpacer: {
    flexGrow: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  checklist: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    gap: 16,
    ...shadowStyles.card,
  },
  checkText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  checkAllContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
    width: '100%',
    alignSelf: 'flex-end',
  },
  checkAllText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#2563eb',
    flex: 1,
    textAlign: 'right',
  },
  cameraButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  genericButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  genericDisabledButton: {
    backgroundColor: '#799eecff',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadowStyles.card,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionDialog: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    ...shadowStyles.card,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1f2937',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4b5563',
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
