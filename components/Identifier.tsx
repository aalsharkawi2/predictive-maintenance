import React, { useRef, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  Text,
  Keyboard,
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
  const firstTextInputRef = useRef<TextInput>(null);
  const secondTextInputRef = useRef<TextInput>(null);
  const thirdTextInputRef = useRef<TextInput>(null);
  const isArabicLetter = (ch: string) =>
    /^[\u0621-\u063A\u0641-\u064A]$/u.test(ch);

  useEffect(() => {
    if (
      !!state.selectedColumnType &&
      !!state.columnNum &&
      !!state.area &&
      !!state.deviceNum
    ) {
      identifierHelperFn.setDeviceId(
        `${state.selectedColumnType} ${state.columnNum}/${state.area}/${state.deviceNum}`,
      );
    }
  }, [
    state.selectedColumnType,
    state.columnNum,
    state.area,
    state.deviceNum,
    state.deviceId,
  ]);
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
          onSelect={(selection) => {
            identifierHelperFn.setColumnType(selection);
            identifierHelperFn.setColumnNum('');
            identifierHelperFn.setArea('');
            identifierHelperFn.setDeviceNum('');
            identifierHelperFn.setDeviceId('');
            if (firstTextInputRef.current) {
              setTimeout(() => firstTextInputRef.current?.focus(), 0);
            }
          }}
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
              ref={firstTextInputRef}
              onKeyPress={({ nativeEvent: { key } }) => {
                if (
                  key === 'Backspace' ||
                  !Number(key) ||
                  key === '0' ||
                  state.columnNum === 0
                ) {
                  identifierHelperFn.setColumnNum('');
                  identifierHelperFn.setDeviceId('');
                  return;
                }
                identifierHelperFn.setColumnNum(Number(key));

                if (secondTextInputRef.current) {
                  setTimeout(() => secondTextInputRef.current?.focus(), 0);
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
              onKeyPress={({ nativeEvent: { key } }) => {
                if (
                  key === 'Backspace' ||
                  key === '0' ||
                  (state.selectedColumnType === 'رعد'
                    ? !(Number(key) || isArabicLetter(key))
                    : !Number(key)) ||
                  state.area === 0
                ) {
                  if (state.area !== '') {
                    identifierHelperFn.setArea('');
                    identifierHelperFn.setDeviceId('');
                    return;
                  }
                }
                if (key === 'Backspace' && state.area === '') {
                  if (firstTextInputRef.current) {
                    setTimeout(() => firstTextInputRef.current?.focus(), 0);
                    identifierHelperFn.setColumnNum('');
                    return;
                  }
                }
                identifierHelperFn.setArea(key);
                if (thirdTextInputRef.current) {
                  setTimeout(() => thirdTextInputRef.current?.focus(), 0);
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
              onKeyPress={({ nativeEvent: { key } }) => {
                if (
                  key === 'Backspace' ||
                  !Number(key) ||
                  key === '0' ||
                  state.deviceNum === 0
                ) {
                  if (state.deviceNum !== '') {
                    identifierHelperFn.setDeviceNum('');
                    identifierHelperFn.setDeviceId('');
                    return;
                  }
                }
                if (key === 'Backspace' && state.deviceNum === '') {
                  if (secondTextInputRef.current) {
                    setTimeout(() => secondTextInputRef.current?.focus(), 0);
                    identifierHelperFn.setArea('');
                    return;
                  }
                }
                identifierHelperFn.setDeviceNum(Number(key));
                setTimeout(() => {
                  thirdTextInputRef.current?.blur();
                  Keyboard.dismiss();
                }, 0);
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
