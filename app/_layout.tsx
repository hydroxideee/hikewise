import { MapProvider } from "@/context/mapContext";
import { StorageProvider } from "@/context/storageContext";
import * as Font from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated"; // must be before react and other imports

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
        "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
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
      <StorageProvider>
        <MapProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </MapProvider>
      </StorageProvider>
    </GestureHandlerRootView>
  );
}
