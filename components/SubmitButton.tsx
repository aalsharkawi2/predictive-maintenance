import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress?: () => void;
  disabled?: boolean;
}

export function SubmitButton({ onPress, disabled }: Props) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, disabled && styles.submitButtonDisabled]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="حفظ وإنهاء"
      accessibilityState={{ disabled: !!disabled }}
    >
      <Text style={styles.submitButtonText}>حفظ وإنهاء</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5b1',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
