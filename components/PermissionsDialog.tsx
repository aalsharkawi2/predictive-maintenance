import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { shadowStyles } from '@/styles/common';

interface PermissionsDialogProps {
  visible: boolean;
  onRequestClose: () => void;
  onOpenSettings: () => void;
}

export function PermissionsDialog({
  visible,
  onRequestClose,
  onOpenSettings,
}: PermissionsDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.permissionDialog}>
          <Text style={styles.permissionTitle}>الأذونات مطلوبة</Text>
          <Text style={styles.permissionText}>
            يحتاج التطبيق إلى إذن الوصول إلى الكاميرا ومكتبة الوسائط لالتقاط
            وحفظ الصور.
          </Text>
          <View style={styles.permissionButtons}>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={onOpenSettings}
            >
              <Text style={styles.permissionButtonText}>فتح الإعدادات</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.permissionButton, { backgroundColor: '#6b7280' }]}
              onPress={onRequestClose}
            >
              <Text style={styles.permissionButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionDialog: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    ...shadowStyles.card,
  },
  permissionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1f2937',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4b5563',
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
