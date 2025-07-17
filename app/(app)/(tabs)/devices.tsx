import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { JSX, useState } from 'react';
import { Camera, CheckCircle2 } from 'lucide-react-native';

type MaintenanceType = 'نهاية' | 'جهاز';
type DeviceType = 'سكينة' | 'محول' | 'لوحة';
type DisconnectingSwitchAction =
  | 'مسح العوازل'
  | 'تشحيم السكينة'
  | 'تعديل اللوبات'
  | 'تغيير التشعيرات';
type TransformerAction =
  | 'تنظيف الجسم والعوازل وجهاز السليكاجيلتنظيف الجسم والعوازل وجهاز السليكاجيل'
  | 'التربيط على العوازل والجسم والكوس والمناولات'
  | 'عزل الفازات بشريط لحام';
type PanelAction =
  | 'تنظيف اللوحة'
  | 'التربيط على الكوس والبارات'
  | 'عزل الفازات بشريط لحام'
  | 'تزويد فوم'
  | 'إزالة عش'
  | 'تغيير قواطع'
  | 'تغيير ورد ومسامير';

type DeviceActionsMap = {
  سكينة: DisconnectingSwitchAction;
  محول: TransformerAction;
  لوحة: PanelAction;
};

type DeviceActions<T extends DeviceType> = DeviceActionsMap[T];

export default function DevicesScreen() {
  const [deviceId, setDeviceId] = useState('');
  const [selectedMaintenanceType, setSelectedMaintenanceType] =
    useState<MaintenanceType | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] =
    useState<DeviceType | null>(null);

  const maintenanceTypes: MaintenanceType[] = ['نهاية', 'جهاز'];
  const deviceTypes: DeviceType[] = ['سكينة', 'محول', 'لوحة'];
  const identifier = (type: MaintenanceType): JSX.Element => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>معرف ال{type}</Text>
        <TextInput
          style={styles.input}
          placeholder={type === 'جهاز' ? 'ص/ع/1/ق/1/ج/1' : 'مغذي J105'}
          value={deviceId}
          onChangeText={setDeviceId}
          textAlign="right"
        />
      </View>
    );
  };
  function actionsButtons<T extends DeviceType>(deviceType: T): JSX.Element {
    const deviceActions: Array<DeviceActions<T>> = (() => {
      switch (deviceType) {
        case 'سكينة':
          return [
            'مسح العوازل',
            'تشحيم السكينة',
            'تعديل اللوبات',
            'تغيير التشعيرات',
          ] as DeviceActions<T>[];
        case 'محول':
          return [
            'تنظيف الجسم والعوازل وجهاز السليكاجيل',
            'التربيط على العوازل والجسم والكوس والمناولات',
            'عزل الفازات بشريط لحام',
          ] as DeviceActions<T>[];
        case 'لوحة':
          return [
            'تنظيف اللوحة',
            'التربيط على الكوس والبارات',
            'عزل الفازات بشريط لحام',
            'تزويد فوم',
            'إزالة عش',
            'تغيير قواطع',
            'تغيير ورد ومسامير',
          ] as DeviceActions<T>[];
        default:
          return [] as DeviceActions<T>[];
      }
    })();
    return (
      <>
        {deviceActions.map((action) => (
          <TouchableOpacity style={styles.checkItem}>
            <CheckCircle2 size={24} color="#2563eb" />
            <Text style={styles.checkText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نوع الصيانة</Text>
          <View style={styles.typeButtons}>
            {maintenanceTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedMaintenanceType === type && styles.selectedType,
                ]}
                onPress={() => setSelectedMaintenanceType(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedMaintenanceType === type && styles.selectedTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {selectedMaintenanceType !== null &&
          identifier(selectedMaintenanceType)}

        {selectedMaintenanceType === 'جهاز' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نوع المكون</Text>
            <View style={styles.typeButtons}>
              {deviceTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedDeviceType === type && styles.selectedType,
                  ]}
                  onPress={() => setSelectedDeviceType(type)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      selectedDeviceType === type && styles.selectedTypeText,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {selectedMaintenanceType === 'جهاز' ? (
          selectedDeviceType !== null ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
              <View style={styles.checklist}>
                {actionsButtons(selectedDeviceType)}
              </View>
            </View>
          ) : (
            <View></View>
          )
        ) : (
          selectedMaintenanceType !== null && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>الإجراءات المتخذة</Text>
              <TextInput
                style={styles.input}
                placeholder="placeholder"
                textAlign="right"
              />
            </View>
          )
        )}
        {selectedDeviceType && (
          <TouchableOpacity style={styles.photoButton}>
            <Camera size={24} color="#ffffff" />
            <Text style={styles.photoButtonText}>التقاط صورة</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    fontFamily: 'Cairo-Regular',
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
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
