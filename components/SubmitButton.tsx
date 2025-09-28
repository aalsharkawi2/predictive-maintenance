import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface Props {
  onPress?: () => void;
}

export function SubmitButton({ onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.submitButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="حفظ وإنهاء"
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
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
