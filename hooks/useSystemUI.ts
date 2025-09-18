import { Platform, StatusBar, AppState } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useFocusEffect } from 'expo-router';

type UIStyle = 'hidden' | 'visible';

const useSystemUI = (style: UIStyle) => {
    const manageUI = (show: boolean) => {
        if (show) {
            StatusBar.setHidden(false, 'fade');
            if (Platform.OS === 'android') {
                NavigationBar.setVisibilityAsync('visible');
            }
        } else {
            StatusBar.setHidden(true, 'fade');
            if (Platform.OS === 'android') {
                NavigationBar.setVisibilityAsync('hidden');
                NavigationBar.setBehaviorAsync('inset-swipe');
            }
        }
    };

    useFocusEffect(
        () => {
            manageUI(style === 'visible');

            const subscription = AppState.addEventListener('change', (nextAppState) => {
                if (nextAppState === 'active') {
                    manageUI(style === 'visible');
                }
            });

            return () => {
                manageUI(true); // Always show when screen loses focus
                subscription.remove();
            };
        },
    );
};

export default useSystemUI;
