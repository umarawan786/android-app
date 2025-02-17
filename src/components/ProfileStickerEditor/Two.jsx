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

const Two = ({ height, handlePress, url }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { width: 0.35 * width, height: 0.4 * height }]}
    >
      <Text style={[styles.text, { color: theme.foreground }]}>2</Text>

      <View style={styles.imageContainer}>
        <Image source={url} style={styles.image} contentFit="contain" />
      </View>
    </Pressable>
  );
};

export default Two;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  imageContainer: {
    width: "50%",
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    position: "absolute",
    top: -30,
    right: 30,
  },
});
