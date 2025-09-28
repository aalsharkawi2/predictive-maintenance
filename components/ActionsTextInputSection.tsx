import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { shadowStyles } from '@/styles/common';

export function ActionsTextInputSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
      <TextInput
        style={shadowStyles.input}
        placeholder="placeholder"
        textAlign="right"
        accessibilityLabel="الإجراءات المتخذة"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'right',
  },
});
