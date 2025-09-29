import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Camera, Pencil } from 'lucide-react-native';
import { shadowStyles } from '@/styles/common';

interface CameraBarProps {
  enabled: boolean;
  onPressCamera: () => void;
  photoUri?: string | null;
  onPressEdit?: () => void;
}

export function CameraBar({
  enabled,
  onPressCamera,
  photoUri,
  onPressEdit,
}: CameraBarProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={enabled ? styles.genericButton : styles.genericDisabledButton}
        onPress={onPressCamera}
        disabled={!enabled}
        accessibilityRole="button"
        accessibilityLabel="التقاط صورة"
      >
        <Camera size={24} color="#ffffff" />
        <Text style={styles.photoButtonText}>التقاط صورة</Text>
      </TouchableOpacity>
      {!!photoUri && (
        <TouchableOpacity
          style={styles.thumbnailContainer}
          onPress={onPressEdit}
          accessibilityLabel="تعديل الصورة"
        >
          <Image source={{ uri: photoUri }} style={styles.thumbnail} />
          <View style={styles.thumbnailOverlay} />
          <Pencil size={24} color="#ffffff" style={styles.pencilOverlay} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  genericButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  genericDisabledButton: {
    backgroundColor: '#799eecff',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoButtonText: { color: '#ffffff', fontFamily: 'Cairo-Bold', fontSize: 16 },
  thumbnailContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadowStyles.card,
  },
  thumbnail: { width: '100%', height: '100%' },
  thumbnailOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  pencilOverlay: {
    position: 'absolute',
    bottom: '28%',
    left: '28%',
    opacity: 0.95,
  },
});
