import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { wp } from "../../helpers/common";
import { useTheme } from "../../providers/ThemeProvider";
import { getContrastRatio } from "../../helpers/colors";

const ThemeOptionBar = ({ themeId, background, foreground }) => {
  const { theme, updateTheme } = useTheme();

  const contrast = getContrastRatio(theme.background, background);

  let borderStyles = { borderWidth: themeId === theme.id ? 3 : 1 };
  if (contrast < 3) {
    borderStyles.borderColor =
      getContrastRatio(theme.background, "#FFFFFF") < 3 ? "black" : "white";
  } else if (contrast > 4.5) {
    borderStyles.borderColor = "white";
  } else {
    borderStyles.borderColor = "#333333";
  }

  const handlePress = () => {
    updateTheme(themeId);
  };

  return (
    <Pressable style={[styles.container, borderStyles]} onPress={handlePress}>
      <View style={[styles.left, { backgroundColor: background }]} />
      <View style={[styles.right, { backgroundColor: foreground }]} />
    </Pressable>
  );
};

export default ThemeOptionBar;

const styles = StyleSheet.create({
  container: {
    width: wp(80),
    height: 40,
    borderRadius: 15,
    overflow: "hidden",
  },
  left: {
    flex: 1,
  },
  right: {
    position: "absolute",
    right: 0,
    top: 0,
    width: "30%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});
