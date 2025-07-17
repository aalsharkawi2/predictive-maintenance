import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import { Provider } from 'react-redux';
import { store } from '@/store';

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Bold': Cairo_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="dark" />
    </Provider>
  );
}
