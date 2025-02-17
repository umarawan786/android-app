import { View, Text } from "react-native";
import React from "react";
import { MyTabBar } from "@/components/MyTabBar/MyTabBar";
import { Tabs } from "expo-router";

import { useTheme } from "@/providers/ThemeProvider";

const _layout = () => {
  const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <MyTabBar
          {...props}
          backgroundColor={theme.background}
          foregroundColor={theme.foreground}
        />
      )}
    >
      {CHILD_TABS_SCREENS.map(({ name, label }) => {
        return (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              tabBarLabel: label,
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default _layout;

export const CHILD_TABS_SCREENS = [
  {
    name: "home",
    label: "Home",
    icon: "home",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "profile",
  },
  {
    name: "learning",
    label: "Learning",
    icon: "learning",
  },
  {
    name: "chat",
    label: "Chat",
    icon: "chat",
  },
];
