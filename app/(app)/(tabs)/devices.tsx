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
import { Camera } from 'lucide-react-native';
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
          {actions.map((actionItem, index) => (
            <ActionCheckItem
              key={`${deviceType}-${index}`}
              label={actionItem.action}
              isSelected={actionItem.isSelected}
              onToggle={() => toggleAction(deviceType, index)}
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
            onSelect={(type) => setMaintenanceType(type)}
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
                style={styles.genericButton}
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
  genericButton: {
    backgroundColor: '#2563eb',
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
