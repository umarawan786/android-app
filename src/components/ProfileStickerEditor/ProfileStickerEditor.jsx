import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import React from "react";

import { hp, scaleFontSize, wp } from "@/helpers/common";
import SVGBackground from "./SVGBackground";
import { useTheme } from "@/providers/ThemeProvider";
import One from "./One";
import Two from "./Two";
import Three from "./Three";
import Four from "./Four";
import { useGifs } from "@/api/profileGifs";
import { useRouter } from "expo-router";

const ProfileStickerEditor = ({ firstName }) => {
  const [height, setHeight] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  const { theme } = useTheme();
  const { width: WINDOW_WIDTH } = useWindowDimensions();

  const { data, isPending, error } = useGifs();

  console.log(data)

  const router = useRouter();

  const handlePress = (container) => {
    router.push({
      pathname: "/child/onboarding/gif_selection",
      params: {
        gifContainer: container,
      },
    });
  };

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setHeight(height);
      }}
    >
      {height !== 0 && (
        <SVGBackground
          width={WINDOW_WIDTH}
          height={height}
          stroke={theme.foreground}
        />
      )}

      {height !== 0 && !isPending && !error && (
        <View
          style={{
            position: "absolute",
            width: WINDOW_WIDTH,
            top: 10,
            gap: 30,
          }}
        >
          <View style={styles.row}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <One
                height={height}
                handlePress={() => handlePress("one")}
                url={data[0]?.one}
              />
              <Text style={[styles.name, { color: theme.foreground }]}>
                {firstName ? firstName.slice(0, 2) : "Aa"}
              </Text>
            </View>
            <Two
              height={height}
              handlePress={() => handlePress("two")}
              url={data[0]?.two}
            />
          </View>
          <View style={styles.row}>
            <Three
              height={height}
              handlePress={() => handlePress("three")}
              url={data[0]?.three}
            />
            <Four
              height={height}
              handlePress={() => handlePress("four")}
              url={data[0]?.four}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileStickerEditor;

const styles = StyleSheet.create({
  container: {
    width: wp(100),
    height: 250,
    justifyContent: "space-between",
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
});
