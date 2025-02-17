import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { scaleFontSize, wp } from "@/helpers/common";
import Icon from "@/icons";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useRouter } from "expo-router";

const IconSize = scaleFontSize(32);

const LiAuraLogo = require("../../assets/images/Liaura-ShadowBlackFilled.png");

const HeaderBar = ({ rightIconOnPress }) => {
  const router = useRouter();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const progress = useDrawerProgress();

  const openNotifications = () => {
    if (rightIconOnPress) {
      rightIconOnPress();
    }
  };

  const handleDrawerOpen = useCallback(() => {
    if (!navigation.toggleDrawer) {
      console.warn("Drawer navigation is not available in this context");
      return;
    }

    navigation.toggleDrawer();
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(progress.value, [0, 1], [0, 20]) }],
    };
  });

  return (
    <Animated.View
      style={[styles.headerBar, { marginTop: top + 10 }, animatedStyle]}
    >
      <Pressable onPress={handleDrawerOpen}>
        <Icon name="menu" size={IconSize} fill="white" />
      </Pressable>

      {/* Logo */}
      <View style={styles.imageContainer}>
        <Image
          source={LiAuraLogo}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Notifications Bell */}
      <Pressable onPress={openNotifications}>
        <Icon name={"bell"} size={IconSize} fill="white" />
      </Pressable>
    </Animated.View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: "row",
    width: wp(100),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: wp(40),
    height: 60,
  },
});
