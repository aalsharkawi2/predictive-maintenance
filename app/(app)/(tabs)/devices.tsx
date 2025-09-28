import React, { useMemo, useRef, useState } from 'react';
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
  Linking,
} from 'react-native';
import { useMaintenanceState } from '@/hooks/useMaintenanceState';
import { ActionsList } from '@/components/ActionsList';
import { MaintenanceType } from '@/types/maintenance';
import { shadowStyles } from '@/styles/common';
import { CameraBar } from '@/components/CameraBar';
import { PermissionsDialog } from '@/components/PermissionsDialog';
import { MaintenanceTypeSelector } from '@/components/MaintenanceTypeSelector';
import { DeviceTypeSelector } from '@/components/DeviceTypeSelector';
import { IdentifierSection } from '@/components/IdentifierSection';
import { ActionsTextInputSection } from '@/components/ActionsTextInputSection';
import { SubmitButton } from '@/components/SubmitButton';
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
    setAllActions,
    setDeviceNote,
    deleteNote,
    setPhoto,
  } = useMaintenanceState();

  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);

  const checkAndRequestPermissions = async () => {
    try {
      const [camera, media] = await Promise.all([
        ImagePicker.requestCameraPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);
      camera.status === 'granted' && media.status === 'granted'
        ? router.push('/camera')
        : setPermissionDialogVisible(true);
    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التحقق من الأذونات');
    }
  };

  // Handle opening device settings
  const handleOpenSettings = () => {
    setPermissionDialogVisible(false);
    Platform.OS === 'ios'
      ? Linking.openURL('app-settings:')
      : Linking.openSettings();
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

  const allActionsSelected = useMemo(() => {
    if (!state.selectedDeviceType) return false;
    const list = state.deviceActions[state.selectedDeviceType];
    return list.length > 0 && list.every((a) => a.isSelected);
  }, [state.deviceActions, state.selectedDeviceType]);

  const anyActionSelected = useMemo(
    () =>
      deviceTypes.some((t) => state.deviceActions[t].some((a) => a.isSelected)),
    [state.deviceActions],
  );
  const renderIdentifier = (type: MaintenanceType) => (
    <IdentifierSection
      title={`معرف ال${type}`}
      type={type}
      state={state}
      identifierHelperFn={{
        setColumnType,
        setColumnNum,
        setArea,
        setDeviceNum,
        setDeviceId,
      }}
    />
  );

  const renderActionsList = () => {
    const deviceType = state.deviceId ? state.selectedDeviceType : null;
    if (!deviceType) return null;
    return (
      <ActionsList
        deviceType={deviceType}
        actions={state.deviceActions[deviceType]}
        notes={state.deviceNotes[deviceType]}
        onToggle={(index) => toggleAction(deviceType, index)}
        onToggleAll={(selected) => setAllActions(deviceType, selected)}
        onAddNote={(note) => setDeviceNote(deviceType, note)}
        onDeleteNote={(note) => deleteNote(deviceType, note)}
        scrollViewRef={scrollViewRef}
        scrollYRef={scrollYRef}
      />
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
          keyboardDismissMode="interactive"
          onScroll={(e) => {
            scrollYRef.current = e.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
        >
          {/* Maintenance Type Selector */}
          <MaintenanceTypeSelector
            options={maintenanceTypes}
            selected={state.selectedMaintenanceType}
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
            <DeviceTypeSelector
              options={deviceTypes}
              selected={state.selectedDeviceType}
              onSelect={setDeviceType}
            />
          )}

          {/* Actions Checklist */}
          {state.selectedMaintenanceType === 'جهاز'
            ? state.selectedDeviceType !== null && renderActionsList()
            : state.selectedMaintenanceType !== null && (
                <ActionsTextInputSection />
              )}
          <View style={styles.flexSpacer} />
          <View style={styles.section}>
            {/* Camera Button and Photo Thumbnail */}
            {!!state.deviceId && (
              <CameraBar
                enabled={anyActionSelected}
                onPressCamera={checkAndRequestPermissions}
                photoUri={
                  state.photo ? state.photo.editedUri || state.photo.uri : null
                }
                onPressEdit={handleEditPhoto}
              />
            )}

            {/* Submit Button */}
            <SubmitButton />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Permissions Dialog */}
      <PermissionsDialog
        visible={permissionDialogVisible}
        onOpenSettings={handleOpenSettings}
        onRequestClose={() => setPermissionDialogVisible(false)}
      />
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
});
