import React from "react";
import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { GUARDIAN_TABS_SCREENS } from "./(tabs)/_layout";

import Icon from "@/icons";

const _layout = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default _layout;

const CustomDrawerContent = () => {
  const router = useRouter();

  return (
    <DrawerContentScrollView>
      {GUARDIAN_TABS_SCREENS.map(({ name, label, icon }) => (
        <DrawerItem
          key={name}
          label={label}
          icon={() => <Icon name={icon} />}
          onPress={() => router.push(`/guardian/${name}`)}
        />
      ))}
    </DrawerContentScrollView>
  );
};
