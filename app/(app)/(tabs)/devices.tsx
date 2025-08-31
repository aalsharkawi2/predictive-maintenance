import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Camera, PlusCircle } from 'lucide-react-native';
import { useMaintenanceState } from '@/hooks/useMaintenanceState';
import { TypeSelector } from '@/components/TypeSelector';
import { ActionCheckItem } from '@/components/ActionCheckItem';
import { Identifier } from '@/components/Identifier';
import { MaintenanceType } from '@/types/maintenance';
import { shadowStyles } from '@/styles/common';

export default function DevicesScreen() {
  const {
    state,
    maintenanceTypes,
    columnTypes,
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
  } = useMaintenanceState();

  const identifierHelperFn = {
    setColumnType,
    setColumnNum,
    setArea,
    setDeviceNum,
    setDeviceId,
  };

  const [note, setNote] = useState<string>('');

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

  const [notesHeight, setNotesHeight] = useState(44);

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
          {notes.map((note) => (
            <Text>ملاحظة: {note}</Text>
          ))}
        </View>
        <View style={styles.addActionItem}>
          <TextInput
            style={[
              shadowStyles.input,
              styles.notesInput,
              { height: Math.max(55, notesHeight) },
            ]}
            onChangeText={setNote}
            placeholder="أضف ملاحظات"
            textAlign="right"
            accessibilityLabel="ملاحظات"
            multiline
            scrollEnabled={true}
            onContentSizeChange={(e) => {
              setNotesHeight(e.nativeEvent.contentSize.height);
            }}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={styles.genericButton}
            onPress={() =>
              state.selectedDeviceType &&
              setDeviceNote(state.selectedDeviceType, note)
            }
            accessibilityRole="button"
            accessibilityLabel="إضافة ملاحظة"
          >
            <PlusCircle size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
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
      </View>
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
  addActionItem: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'flex-start',
    gap: 12,
  },
  notesInput: {
    minHeight: 44,
    maxHeight: 160,
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
