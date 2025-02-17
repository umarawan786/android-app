import React from "react";
import { Tabs } from "expo-router";
import { MyTabBar } from "@/components/MyTabBar/MyTabBar";

const _layout = () => {
  return (
    <Tabs
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {GUARDIAN_TABS_SCREENS.map(({ name, label }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarLabel: label,
          }}
        />
      ))}
    </Tabs>
  );
};

export default _layout;

export const GUARDIAN_TABS_SCREENS = [
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
    name: "settings",
    label: "Settings",
    icon: "settings",
  },
];
