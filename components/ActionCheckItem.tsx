import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
} from 'react-native';

interface ActionCheckItemProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  Icon: LucideIcon;
  TextStyle: TextStyle;
}

export function ActionCheckItem({
  label,
  isSelected,
  onToggle,
  Icon,
  TextStyle,
}: ActionCheckItemProps) {
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
        <Icon size={24} color={isSelected ? '#ffffff' : '#2563eb'} />
      </View>
      <Text style={TextStyle}>{label}</Text>
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
});
