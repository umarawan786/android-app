import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Alert, AppState } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { focusManager } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import AuthProvider from "@/providers/AuthProvider";
import NotificationsProvider from "@/providers/NotificationsProvider";
import QueryProvider from "@/providers/QueryProvider";
import { useCustomFonts } from "../constants/fonts";
import { supabase } from "../lib/supabase";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [fontsLoaded, fontsLoadedError] = useCustomFonts();

  React.useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
        focusManager.setFocused(true); // Refetch on app focus
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    if (__DEV__) {
      console.warn("App running in dev mode");
    } else {
      console.warn("App running in prod mode");
    }

    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    if (fontsLoadedError) {
      Alert.alert(
        "Error",
        "Failed to load application fonts. Some visual elements might not display correctly."
      );
    }
  }, [fontsLoadedError]);

  React.useEffect(() => {
    (async () => {
      try {
        if (fontsLoaded) {
          SplashScreen.hide();
        }
      } catch (error) {
        console.error("Failed to hide splash screen: ", error);
      }
    })();
  }, [fontsLoaded]);

  console.log("source layout rendered");
  return (
    <GestureHandlerRootView>
      <StatusBar style="light" translucent animated />
      <AuthProvider>
        <QueryProvider>
          <NotificationsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
            </Stack>
          </NotificationsProvider>
        </QueryProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
