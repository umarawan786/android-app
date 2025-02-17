import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { useTheme } from "../../providers/ThemeProvider";

const Four = ({ height, handlePress, url }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { width: 0.35 * width, height: 0.4 * height }]}
    >
      <Text style={[styles.text, { color: theme.foreground }]}>4</Text>

      <Image
        source={url}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
    </Pressable>
  );
};

export default Four;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "50%",
    aspectRatio: 1,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    position: "absolute",
    bottom: -30,
    right: 30,
  },
});
