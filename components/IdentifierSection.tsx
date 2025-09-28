import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Identifier } from '@/components/Identifier';
import { MaintenanceType, MaintenanceState } from '@/types/maintenance';

interface IdentifierSectionProps {
  title: string;
  type: MaintenanceType;
  state: MaintenanceState;
  identifierHelperFn: {
    setColumnType: (t: any) => void;
    setColumnNum: (n: number | '') => void;
    setArea: (n: number | string) => void;
    setDeviceNum: (n: number | '') => void;
    setDeviceId: (id: string) => void;
  };
}

export function IdentifierSection({
  title,
  type,
  state,
  identifierHelperFn,
}: IdentifierSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Identifier
        type={type}
        state={state}
        identifierHelperFn={identifierHelperFn}
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
