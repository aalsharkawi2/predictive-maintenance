import { Tabs } from 'expo-router';
import { ClipboardList, Settings, Home, History } from 'lucide-react-native';
import { I18nManager } from 'react-native';
import useSystemUI from '@/hooks/useSystemUI';
import { useEffect } from 'react';
import { View } from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

if (!I18nManager.isRTL) {
  I18nManager.forceRTL(false);
}

export default function TabLayout() {
  useSystemUI('visible');

  useEffect(() => {
    // Configure AvoidSoftInput to prevent the tab bar from moving
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);
    AvoidSoftInput.setAvoidOffset(70); // Height of tab bar
    AvoidSoftInput.setEasing('easeInOut');
    AvoidSoftInput.setHideAnimationDelay(0);
    AvoidSoftInput.setHideAnimationDuration(220);
    AvoidSoftInput.setShowAnimationDelay(0);
    AvoidSoftInput.setShowAnimationDuration(220);

    return () => {
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {},
          tabBarStyle: {
            height: 70,
            direction: 'rtl',
            paddingBottom: 5,
            paddingTop: 5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: { fontFamily: 'Cairo6Regular' },
          headerTitleStyle: { fontFamily: 'Cairo-Bold' },
          headerTitleAlign: 'center',
          tabBarHideOnKeyboard: false,
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'الرئيسية',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            headerTitle: 'الرئيسية',
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: 'الأجهزة',
            tabBarIcon: ({ color, size }) => (
              <ClipboardList size={size} color={color} />
            ),
            headerTitle: 'الأجهزة',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'السجل',
            tabBarIcon: ({ color, size }) => (
              <History size={size} color={color} />
            ),
            headerTitle: 'السجل',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'الإعدادات',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
            headerTitle: 'الإعدادات',
          }}
        />
      </Tabs>
    </View>
  );
}
