import { shadowStyles } from '@/styles/common';
import { DeviceType } from '@/types/maintenance';
import { PlusCircle } from 'lucide-react-native';
import { RefObject, useRef, useState } from 'react';
import {
  View,
  findNodeHandle,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  UIManager,
  StyleSheet,
  Keyboard,
} from 'react-native';

interface AddNoteProps {
  deviceType: DeviceType;
  setDeviceNote: (deviceType: DeviceType, note: string) => void;
  scrollViewRef: RefObject<ScrollView | null>;
  scrollYRef: RefObject<number>;
}

export function AddNote({
  deviceType,
  setDeviceNote,
  scrollViewRef,
  scrollYRef,
}: AddNoteProps) {
  const [note, setNote] = useState<string>('');
  const [notesHeight, setNotesHeight] = useState(44);
  const TextInputRef = useRef<TextInput>(null);
  const prevVisibleNotesHeightRef = useRef(56);

  const scrollToNotesInput = () => {
    if (Platform.OS === 'web') {
      return;
    }
    if (TextInputRef.current?.isFocused?.()) {
      const inputHandle = findNodeHandle(TextInputRef.current);
      const scrollHandle = findNodeHandle(scrollViewRef.current);
      if (!inputHandle || !scrollHandle || !scrollViewRef.current) return;
      UIManager.measureLayout(
        inputHandle,
        scrollHandle,
        () => {},
        (_x, y, _w, _h) => {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, y - 16),
            animated: true,
          });
        },
      );
    }
  };

  return (
    <View style={styles.addNoteItem}>
      <TextInput
        style={[
          shadowStyles.input,
          styles.notesInput,
          { height: Math.max(56, notesHeight) },
        ]}
        onChangeText={setNote}
        value={note}
        ref={TextInputRef}
        placeholder="أضف ملاحظات"
        textAlign="right"
        accessibilityLabel="ملاحظات"
        multiline
        scrollEnabled={true}
        onFocus={() => {
          setTimeout(scrollToNotesInput, 50);
        }}
        onLayout={() => {
          setTimeout(scrollToNotesInput, 0);
        }}
        onContentSizeChange={(e) => {
          if (Platform.OS === 'web') {
            if (TextInputRef.current?.isFocused?.()) {
              setTimeout(scrollToNotesInput, 0);
            }
            return;
          }
          const newContentH = e.nativeEvent.contentSize.height;
          setNotesHeight(newContentH);
          const visibleH = Math.max(56, Math.min(newContentH, 160));
          const delta = visibleH - prevVisibleNotesHeightRef.current;
          if (delta > 0 && TextInputRef.current?.isFocused?.()) {
            const currentY = scrollYRef.current || 0;
            scrollViewRef.current?.scrollTo({
              y: currentY + delta,
              animated: true,
            });
          }
          prevVisibleNotesHeightRef.current = visibleH;
        }}
        textAlignVertical="top"
      />
      <TouchableOpacity
        style={styles.genericButton}
        onPress={() => {
          if (deviceType && note.trim()) {
            setDeviceNote(deviceType, note.trim());
            setNote('');
            setNotesHeight(44);
            prevVisibleNotesHeightRef.current = 56;
            TextInputRef.current?.blur();
            Keyboard.dismiss();
          }
        }}
        accessibilityRole="button"
        accessibilityLabel="إضافة ملاحظة"
      >
        <PlusCircle size={24} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addNoteItem: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    gap: 12,
  },
  notesInput: {
    minHeight: 44,
    maxHeight: 160,
  },
  genericButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
