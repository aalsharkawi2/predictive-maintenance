import React, { useRef, useEffect } from 'react';
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
  identifierHelperFn: {
    setColumnType: (option: ColumnType) => void;
    setColumnNum: (num: number | '') => void;
    setArea: (area: string | number) => void;
    setDeviceNum: (num: number | '') => void;
    setDeviceId: (id: string) => void;
  };
}

export function Identifier({
  type,
  state,
  identifierHelperFn,
}: IdentifierProps) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 420;
  const secondTextInputRef = useRef<TextInput>(null);
  const thirdTextInputRef = useRef<TextInput>(null);
  useEffect(() => {
    identifierHelperFn.setDeviceId(
      `${state.selectedColumnType}-${state.columnNum}-${state.area}-${state.deviceNum}`,
    );
  }, [state.selectedColumnType, state.columnNum, state.area, state.deviceNum]);

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
          onSelect={identifierHelperFn.setColumnType}
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
              value={!state.columnNum ? '' : `${state.columnNum}`}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => {
                const next = state.area;
                const prev = state.columnNum;
                if (text === '0') {
                  identifierHelperFn.setColumnNum('');
                } else {
                  identifierHelperFn.setColumnNum(Number(text));
                }
                if (secondTextInputRef.current && !next && !prev) {
                  secondTextInputRef.current.focus();
                }
              }}
              textAlign="right"
              accessibilityLabel={`رقم العمود`}
            />
          </View>
          <View style={styles.fieldCol}>
            <Text style={styles.label}>رقم القطعة</Text>
            <TextInput
              style={shadowStyles.input}
              placeholder={'ق'}
              value={`${state.area}`}
              keyboardType={
                !(state.selectedColumnType === 'رعد') ? 'number-pad' : undefined
              }
              maxLength={1}
              ref={secondTextInputRef}
              onChangeText={(text) => {
                const next = state.deviceNum;
                const prev = state.area;
                identifierHelperFn.setArea(text);
                if (thirdTextInputRef.current && !next && !prev) {
                  thirdTextInputRef.current.focus();
                }
              }}
              textAlign="right"
              accessibilityLabel={`رقم القطعة`}
            />
          </View>
          <View style={styles.fieldCol}>
            <Text style={styles.label}>رقم الجهاز</Text>
            <TextInput
              style={shadowStyles.input}
              placeholder={'ج'}
              value={!state.deviceNum ? '' : `${state.deviceNum}`}
              keyboardType="number-pad"
              maxLength={1}
              ref={thirdTextInputRef}
              onChangeText={(text) => {
                if (text === '0') {
                  identifierHelperFn.setDeviceNum('');
                } else {
                  identifierHelperFn.setDeviceNum(Number(text));
                }
              }}
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
      onChangeText={identifierHelperFn.setDeviceId}
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
