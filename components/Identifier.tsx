import React from 'react';
import {
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import { shadowStyles } from '@/styles/common';
import { ColumnType, MaintenanceState } from '@/types/maintenance';
import { TypeButtons } from './TypeButtons';
import { columnTypes } from '@/hooks/useMaintenanceState';

interface IdentifierProps {
  type: string;
  state: MaintenanceState;
  setColumnType: (option: ColumnType) => void;
  setDeviceId: (option: string) => void;
}

export function Identifier({
  type,
  state,
  setColumnType,
  setDeviceId,
}: IdentifierProps) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;

  return type === 'جهاز' ? (
    <View style={[styles.identifier, isNarrow && styles.identifierNarrow]}>
      <View
        style={
          isNarrow || !state.selectedColumnType
            ? styles.typeButtonsWrapperNarrow
            : styles.typeButtonsWrapper
        }
      >
        <TypeButtons
          options={columnTypes}
          selectedOption={state.selectedColumnType}
          onSelect={setColumnType}
        />
      </View>
      {state.selectedColumnType && (
        <View
          style={[
            styles.identifierFields,
            isNarrow && styles.identifierFieldsNarrow,
          ]}
        >
          <View style={styles.fieldCol}>
            <Text style={styles.label}>رقم العمود</Text>
            <TextInput
              style={shadowStyles.input}
              placeholder={'ع'}
              value={state.deviceId}
              keyboardType="number-pad"
              onChangeText={setDeviceId}
              textAlign="right"
              accessibilityLabel={`رقم العمود`}
            />
          </View>
          <View style={styles.fieldCol}>
            <Text style={styles.label}>رقم القطعة</Text>
            <TextInput
              style={shadowStyles.input}
              placeholder={'ق'}
              value={state.deviceId}
              keyboardType={
                !(state.selectedColumnType === 'رعد') ? 'number-pad' : undefined
              }
              onChangeText={setDeviceId}
              textAlign="right"
              accessibilityLabel={`رقم القطعة`}
            />
          </View>
          <View style={styles.fieldCol}>
            <Text style={styles.label}>رقم الجهاز</Text>
            <TextInput
              style={shadowStyles.input}
              placeholder={'ج'}
              value={state.deviceId}
              keyboardType="number-pad"
              onChangeText={setDeviceId}
              textAlign="right"
              accessibilityLabel={`رقم الجهاز`}
            />
          </View>
        </View>
      )}
    </View>
  ) : (
    <TextInput
      style={shadowStyles.input}
      placeholder={'J105 مثال: مغذي'}
      value={state.deviceId}
      onChangeText={setDeviceId}
      textAlign="right"
      accessibilityLabel={`معرف ال${type}`}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: 'Cairo-Regular',
    color: '#1f2937',
    textAlign: 'right',
  },
  identifier: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    gap: 12,
  },
  identifierNarrow: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
  },
  identifierFields: {
    flex: 1,
    flexDirection: 'row-reverse',
    gap: 12,
    minWidth: 0,
  },
  identifierFieldsNarrow: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  typeButtonsWrapper: {
    flexShrink: 0,
    maxWidth: 180,
  },
  typeButtonsWrapperNarrow: {
    width: '100%',
  },
  fieldCol: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
  },
});
