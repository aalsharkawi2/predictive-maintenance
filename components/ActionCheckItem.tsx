import { LucideIcon } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  StyleProp,
} from 'react-native';

interface ActionCheckItemProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  Icon: LucideIcon;
  textStyle: StyleProp<TextStyle>;
  plainIcon?: boolean;
  iconColor?: string;
}

export function ActionCheckItem({
  label,
  isSelected,
  onToggle,
  Icon,
  textStyle,
  plainIcon = false,
  iconColor,
}: ActionCheckItemProps) {
  return (
    <TouchableOpacity
      style={styles.checkItem}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked: isSelected }}
    >
      {plainIcon ? (
        <Icon size={24} color={iconColor ?? '#2563eb'} />
      ) : (
        <View
          style={[
            styles.checkCircleContainer,
            isSelected && styles.selectedCheckCircleContainer,
          ]}
        >
          <Icon size={24} color={isSelected ? '#ffffff' : '#2563eb'} />
        </View>
      )}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkItem: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  checkCircleContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckCircleContainer: {
    borderRadius: 20,
    backgroundColor: '#2563eb',
  },
});
