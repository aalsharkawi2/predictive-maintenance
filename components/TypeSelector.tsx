import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { shadowStyles } from '@/styles/common';
import { TypeButtons } from './TypeButtons';

interface TypeSelectorProps<T extends string> {
  title: string;
  options: T[];
  selectedOption: T | null;
  onSelect: (option: T) => void;
}

export function TypeSelector<T extends string>({
  title,
  options,
  selectedOption,
  onSelect,
}: TypeSelectorProps<T>) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TypeButtons
        options={options}
        selectedOption={selectedOption}
        onSelect={onSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    ...shadowStyles.card,
  },
  selectedType: {
    backgroundColor: '#2563eb',
  },
  typeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#1f2937',
  },
  selectedTypeText: {
    color: '#ffffff',
  },
});
