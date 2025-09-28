import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DeviceType } from '@/types/maintenance';
import { ActionCheckItem } from './ActionCheckItem';
import { NoteItem } from './NoteItem';
import { AddNote } from './AddNote';
import { CheckCheck, CheckCircle2 } from 'lucide-react-native';
import { shadowStyles } from '@/styles/common';
import { RefObject } from 'react';
import { ScrollView } from 'react-native';

interface ActionsListProps {
  deviceType: DeviceType;
  actions: { action: string; isSelected: boolean }[];
  notes: string[];
  onToggle: (index: number) => void;
  onToggleAll: (selected: boolean) => void;
  onAddNote: (note: string) => void;
  onDeleteNote: (note: string) => void;
  scrollViewRef: RefObject<ScrollView | null>;
  scrollYRef: React.MutableRefObject<number>;
}

export function ActionsList({
  deviceType,
  actions,
  notes,
  onToggle,
  onToggleAll,
  onAddNote,
  onDeleteNote,
  scrollViewRef,
  scrollYRef,
}: ActionsListProps) {
  const allSelected = actions.length > 0 && actions.every((a) => a.isSelected);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
      <View style={styles.checklist}>
        <View style={styles.checkAllContainer}>
          <ActionCheckItem
            label={'اختيار الكل'}
            isSelected={allSelected}
            onToggle={() => onToggleAll(!allSelected)}
            Icon={CheckCheck}
            plainIcon
            iconColor={'#2563eb'}
            textStyle={styles.checkAllText}
          />
        </View>
        {actions.map((actionItem, index) => (
          <ActionCheckItem
            key={`${deviceType}-${index}`}
            label={actionItem.action}
            isSelected={actionItem.isSelected}
            onToggle={() => onToggle(index)}
            Icon={CheckCircle2}
            textStyle={styles.checkText}
          />
        ))}
        {notes.map((note, idx) => (
          <NoteItem
            key={`${deviceType}-note-${idx}`}
            note={note}
            onDelete={() => onDeleteNote(note)}
          />
        ))}
      </View>
      <AddNote
        deviceType={deviceType}
        setDeviceNote={(_, note) => onAddNote(note)}
        scrollViewRef={scrollViewRef}
        scrollYRef={scrollYRef}
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
  checklist: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    gap: 16,
    alignItems: 'stretch',
    ...shadowStyles.card,
  },
  checkText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
  checkAllContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
    width: '100%',
    alignSelf: 'flex-end',
  },
  checkAllText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    lineHeight: 22,
    color: '#2563eb',
    flex: 1,
    textAlign: 'right',
  },
});
