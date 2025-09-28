import { Tabs } from 'expo-router';
import { ClipboardList, Settings, Home, History } from 'lucide-react-native';
import { I18nManager, Keyboard } from 'react-native';
import useSystemUI from '@/hooks/useSystemUI';
import { useEffect, useRef, useState } from 'react';

if (!I18nManager.isRTL) {
  I18nManager.forceRTL(false);
}

export default function TabLayout() {
  useSystemUI('visible');
  const [keyboardShow, setKeyboardShow] = useState<boolean>(false);
  const [tabBarVisible, setTabBarVisible] = useState<boolean>(true);
  const showDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const DELAY_MS = 300; // adjust as needed

    const onKeyboardShow = () => {
      // Hide immediately when keyboard shows
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
        showDelayRef.current = null;
      }
      setKeyboardShow(true);
      setTabBarVisible(false);
    };

    const onKeyboardHide = () => {
      // Delay re-show after keyboard hides
      setKeyboardShow(false);
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
      }
      showDelayRef.current = setTimeout(() => {
        setTabBarVisible(true);
        showDelayRef.current = null;
      }, DELAY_MS);
    };

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardHide,
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (showDelayRef.current) {
        clearTimeout(showDelayRef.current);
      }
    };
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {},
        tabBarStyle: {
          height: tabBarVisible ? 70 : 0,
          direction: 'rtl',
          paddingBottom: tabBarVisible ? 5 : 0,
          paddingTop: tabBarVisible ? 5 : 0,
          opacity: tabBarVisible ? 1 : 0,
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
  );
}
