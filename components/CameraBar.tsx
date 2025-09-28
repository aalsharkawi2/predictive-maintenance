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
          <View style={styles.editIconContainer}>
            <Pencil size={12} color="#ffffff" />
          </View>
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  genericDisabledButton: {
    backgroundColor: '#799eecff',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  photoButtonText: { color: '#ffffff', fontFamily: 'Cairo-Bold', fontSize: 16 },
  thumbnailContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    ...shadowStyles.card,
  },
  thumbnail: { width: '100%', height: '100%' },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
