import { Tabs } from 'expo-router';
import { ClipboardList, Settings, Home, History } from 'lucide-react-native';
import { I18nManager } from 'react-native';

if (!I18nManager.isRTL) {
  I18nManager.forceRTL(false);
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { height: 100, direction: 'rtl' },
        tabBarLabelStyle: { fontFamily: 'Cairo-Regular' },
        headerTitleStyle: { fontFamily: 'Cairo-Bold' },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'الأجهزة',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'السجل',
          tabBarIcon: ({ color, size }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'الإعدادات',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
