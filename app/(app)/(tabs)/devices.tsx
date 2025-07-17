import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react-native';

type DeviceType = 'سكينة' | 'جهاز' | 'لوحة';

export default function DevicesScreen() {
  const [deviceId, setDeviceId] = useState('');
  const [selectedType, setSelectedType] = useState<DeviceType | null>(null);

  const deviceTypes: DeviceType[] = ['سكينة', 'جهاز', 'لوحة'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معرف الجهاز</Text>
          <TextInput
            style={styles.input}
            placeholder="ص/ع/1/ق/1/ج/1"
            value={deviceId}
            onChangeText={setDeviceId}
            textAlign="right"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نوع المكون</Text>
          <View style={styles.typeButtons}>
            {deviceTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.selectedType,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الإجراءات المطلوبة</Text>
          <View style={styles.checklist}>
            <TouchableOpacity style={styles.checkItem}>
              <CheckCircle2 size={24} color="#2563eb" />
              <Text style={styles.checkText}>فحص التوصيلات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkItem}>
              <CheckCircle2 size={24} color="#2563eb" />
              <Text style={styles.checkText}>تنظيف المكونات</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkItem}>
              <CheckCircle2 size={24} color="#2563eb" />
              <Text style={styles.checkText}>فحص العوازل</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.photoButton}>
          <Camera size={24} color="#ffffff" />
          <Text style={styles.photoButtonText}>التقاط صورة</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>حفظ وإنهاء</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedType: {
    backgroundColor: '#2563eb',
  },
  typeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#1f2937',
  },
  selectedTypeText: {
    color: '#ffffff',
  },
  checklist: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#1f2937',
  },
  photoButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
  },
});
