import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { shadowStyles } from '@/styles/common';

interface TypeButtonsProps<T extends string> {
  options: T[];
  selectedOption: T | null;
  onSelect: (option: T) => void;
}

export function TypeButtons<T extends string>({
  options,
  selectedOption,
  onSelect,
}: TypeButtonsProps<T>) {
  return (
    <View style={styles.typeButtons}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.typeButton,
            selectedOption === option && styles.selectedType,
          ]}
          onPress={() => onSelect(option)}
          accessibilityRole="button"
          accessibilityLabel={option}
          accessibilityState={{ selected: selectedOption === option }}
        >
          <Text
            style={[
              styles.typeText,
              selectedOption === option && styles.selectedTypeText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
