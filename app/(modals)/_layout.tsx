import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === 'ios' ? 'fullScreenModal' : 'modal',
        animation: 'slide_from_bottom',
        animationDuration: 300,
        contentStyle: { backgroundColor: 'black' },
        fullScreenGestureEnabled: true,
        navigationBarColor: 'black',
        navigationBarHidden: true,
        statusBarHidden: true,
      }}
    />
  );
}
