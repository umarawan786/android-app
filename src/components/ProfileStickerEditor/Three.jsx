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
import { hp, wp } from "../../helpers/common";

const Three = ({ height, handlePress, url }) => {
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { width: 0.6 * width, height: 0.4 * height }]}
    >
      <Text style={[styles.text, { color: theme.foreground }]}>3</Text>

      <View
        style={[
          styles.imageContainer,
          { width: 0.6 * width, height: 0.4 * height },
        ]}
      >
        <Image
          source={url}
          style={styles.image}
          contentFit="contain"
          transition={1000}
        />
      </View>
    </Pressable>
  );
};

export default Three;

const styles = StyleSheet.create({
  container: { justifyContent: "center", alignItems: "center" },
  image: {
    width: "30%",
    aspectRatio: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    position: "absolute",
    bottom: -40,
    left: 30,
  },
});
