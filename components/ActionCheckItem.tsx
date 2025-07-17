import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

interface ActionCheckItemProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function ActionCheckItem({ label, isSelected, onToggle }: ActionCheckItemProps) {
  return (
    <TouchableOpacity
      style={styles.checkItem}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: isSelected }}
    >
      <View
        style={[
          styles.checkCircleContainer,
          isSelected && styles.selectedCheckCircleContainer,
        ]}
      >
        <CheckCircle2
          size={24}
          color={isSelected ? '#ffffff' : '#2563eb'}
        />
      </View>
      <Text style={styles.checkText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  checkCircleContainer: {
    width: 26,
    height: 26,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircleContainer: {
    borderRadius: 20,
    backgroundColor: '#2563eb',
  },
  checkText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
});