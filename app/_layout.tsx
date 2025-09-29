import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import { Provider } from 'react-redux';
import { store } from '@/store';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Bold': Cairo_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)"
            options={{
              presentation: 'modal',
              headerShown: false,
              navigationBarHidden: true,
              statusBarHidden: true,
            }}
          />
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
        <StatusBar style="dark" />
      </Provider>
    </GestureHandlerRootView>
  );
}
