import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { useRouter } from 'expo-router';
import { LogOut, Bell, Moon, Upload } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const engineer = useSelector((state: RootState) => state.auth.engineer);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.engineerName}>{engineer}</Text>
        <Text style={styles.role}>مهندس صيانة</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={24} color="#1f2937" />
            <Text style={styles.settingText}>الإشعارات</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={notifications ? '#2563eb' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Moon size={24} color="#1f2937" />
            <Text style={styles.settingText}>الوضع الليلي</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={darkMode ? '#2563eb' : '#9ca3af'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Upload size={24} color="#1f2937" />
            <Text style={styles.settingText}>مزامنة تلقائية</Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={autoSync ? '#2563eb' : '#9ca3af'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#dc2626" />
        <Text style={styles.logoutText}>تسجيل الخروج</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  engineerName: {
    fontSize: 24,
    fontFamily: 'Cairo-Bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: '#1f2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 12,
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Cairo-Bold',
    color: '#dc2626',
  },
});
