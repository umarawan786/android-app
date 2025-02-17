import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

const _layout = () => {
  const { session } = useAuth();

  if (session) {
    return <Redirect href={"/"} />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
};

export default _layout;
