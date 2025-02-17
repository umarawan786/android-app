import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";

export default function GradientScreenWrapper({
  colors = [theme.colors.gradientStart, theme.colors.gradientEnd],
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  children,
}) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={start}
        end={end}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: hp(110),
    width: wp(100),
  },
});
