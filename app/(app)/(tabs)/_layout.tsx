import { Tabs } from 'expo-router';
import { ClipboardList, Settings, Home, History } from 'lucide-react-native';
import { I18nManager, Dimensions, Keyboard } from 'react-native';
import useSystemUI from '@/hooks/useSystemUI';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

if (!I18nManager.isRTL) {
  I18nManager.forceRTL(false);
}

export default function TabLayout() {
  useSystemUI('visible');
  const [keyboardShow, setKeyboardShow] = useState<boolean>();
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardShow(false);
      },
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
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
            marginBottom: keyboardShow ? -40 : 0,
            marginTop: keyboardShow ? -4 : 0,
            opacity: keyboardShow ? 0 : 1,
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
            title: keyboardShow ? '' : 'الرئيسية',
            tabBarIcon: ({ color, size }) => (
              <Home size={size} color={keyboardShow ? '#f5f5f5' : color} />
            ),
            headerTitle: 'الرئيسية',
          }}
        />
        <Tabs.Screen
          name="devices"
          options={{
            title: keyboardShow ? '' : 'الأجهزة',
            tabBarIcon: ({ color, size }) => (
              <ClipboardList
                size={size}
                color={keyboardShow ? '#f5f5f5' : color}
              />
            ),
            headerTitle: 'الأجهزة',
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: keyboardShow ? '' : 'السجل',
            tabBarIcon: ({ color, size }) => (
              <History size={size} color={keyboardShow ? '#f5f5f5' : color} />
            ),
            headerTitle: 'السجل',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: keyboardShow ? '' : 'الإعدادات',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={keyboardShow ? '#f5f5f5' : color} />
            ),
            headerTitle: 'الإعدادات',
          }}
        />
      </Tabs>
      {keyboardShow && (
        <View pointerEvents="auto" style={styles.tabBarOverlay} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70, // same as tab bar height
    zIndex: 999,
  },
});
