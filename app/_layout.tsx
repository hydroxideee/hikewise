import 'react-native-reanimated'; // must be before react and other imports
import React, { useCallback, useEffect, useState } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { storageContext } from '/context/storageContext';


SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'JetBrainsMono-Regular': require('../assets/fonts/JetBrainsMono-Regular.ttf'),
        'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Bold.ttf'),
      });
      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
      <GestureHandlerRootView>
        <storageProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </storageProvider>
      </GestureHandlerRootView>
    );
}

