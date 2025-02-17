import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";

import { SCREENS as GUARDIAN_ROOT_TAB_SCREENS } from "../navigators/guardian/GuardianRootTabNavigator";
import { SCREENS as CHILD_ROOT_TAB_SCREENS } from "../navigators/child/ChildRootTabNavigator";
import Icon from "../icons";

const DrawerContent = (props) => {
  const navigation = useNavigation();
  const currentRoute = navigation.getCurrentRoute();

  console.log("currentRoute", currentRoute);

  if (!currentRoute) {
    return null;
  }

  return (
    <DrawerContentScrollView {...props}>
      {currentRoute.name.includes("Guardian") &&
        GUARDIAN_ROOT_TAB_SCREENS.map(({ name, label, icon }) => {
          return (
            <DrawerItem
              key={name}
              label={label}
              focused={currentRoute.name.includes(label)}
              icon={() => {
                return <Icon name={icon} />;
              }}
              onPress={() => {
                navigation.navigate("GuardianRootTabNavigator", {
                  screen: name,
                });
              }}
            />
          );
        })}
      {currentRoute.name.includes("Child") &&
        CHILD_ROOT_TAB_SCREENS.map(({ name, label, icon }) => {
          return (
            <DrawerItem
              key={name}
              label={label}
              focused={currentRoute.name.includes(label)}
              icon={() => {
                return <Icon name={icon} />;
              }}
              onPress={() => {
                navigation.navigate("ChildRootTabNavigator", {
                  screen: name,
                });
              }}
            />
          );
        })}
    </DrawerContentScrollView>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({});
