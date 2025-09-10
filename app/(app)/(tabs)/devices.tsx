import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Camera, CheckCheck, CheckCircle2 } from 'lucide-react-native';
import { useMaintenanceState } from '@/hooks/useMaintenanceState';
import { TypeSelector } from '@/components/TypeSelector';
import { ActionCheckItem } from '@/components/ActionCheckItem';
import { NoteItem } from '@/components/NoteItem';
import { Identifier } from '@/components/Identifier';
import { MaintenanceType } from '@/types/maintenance';
import { shadowStyles } from '@/styles/common';
import { AddNote } from '@/components/AddNote';

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
  } = useMaintenanceState();

  const identifierHelperFn = {
    setColumnType,
    setColumnNum,
    setArea,
    setDeviceNum,
    setDeviceId,
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollYRef = useRef(0);

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
    <SafeAreaView style={styles.container}>
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
            {/* Camera Button */}
            {!!state.deviceId && (
              <TouchableOpacity
                style={[
                  isAnyActionChecked()
                    ? styles.genericButton
                    : styles.genericDisabledButton,
                ]}
                accessibilityRole="button"
                accessibilityLabel="التقاط صورة"
              >
                <Camera size={24} color="#ffffff" />
                <Text style={styles.photoButtonText}>التقاط صورة</Text>
              </TouchableOpacity>
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
  genericButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genericDisabledButton: {
    backgroundColor: '#799eecff',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
