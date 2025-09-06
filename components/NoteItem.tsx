import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { XCircle } from 'lucide-react-native';

interface NoteItemProps {
  note: string;
  onDelete: () => void;
}

export function NoteItem({ note, onDelete }: NoteItemProps) {
  return (
    <TouchableOpacity
      onPress={onDelete}
      accessibilityRole="button"
      accessibilityLabel={'Note with a delete button'}
    >
      <Text style={styles.noteRowText}>
        <Text style={styles.noteLabel}>ملاحظة: </Text>
        <Text style={styles.noteContentText}>{note}</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  xCircleContainer: {
    borderRadius: 20,
    backgroundColor: '#fff',
    marginStart: 9,
  },
  noteRowText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  noteLabel: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#eb2525ff',
  },
  noteContentText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#1f2937',
  },
});
