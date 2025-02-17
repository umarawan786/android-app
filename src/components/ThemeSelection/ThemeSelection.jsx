import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { themeColorOptions, useTheme } from "../../providers/ThemeProvider";
import ThemeOptionBar from "./ThemeOptionBar";

const ThemeSelection = () => {
  return (
    <View style={styles.container}>
      {themeColorOptions.map(({ id, background, foreground }) => (
        <ThemeOptionBar
          key={id}
          themeId={id}
          background={background}
          foreground={foreground}
        />
      ))}
    </View>
  );
};

export default ThemeSelection;

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});
