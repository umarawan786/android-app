import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Icon from "@/icons";
import Dots from "@/components/Dots";
import { hp, scaleFontSize, wp } from "@/helpers/common";
import ProfileStickerEditor from "@/components/ProfileStickerEditor/ProfileStickerEditor";
import Avatar from "@/components/Avatar";
import { useRouter } from "expo-router";

const CustomizeProfile = () => {
  const { theme } = useTheme();
  const { profile } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    router.push("/child/onboarding/goal_setting");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Name Title */}
      <Text style={[styles.text, styles.name, { color: theme.foreground }]}>
        {profile.first_name}
      </Text>

      {/* Avatar Container */}
      <View style={[styles.avatarContainer, { borderColor: theme.foreground }]}>
        <Avatar
          location={profile?.avatar_file_location}
          imageStyles={{ borderRadius: wp(15) }}
        />
      </View>

      {/* Dots */}
      <Dots number={3} highlighted={2} color={theme.foreground} width={wp(4)} />

      <View style={styles.headingContainer}>
        {/* Heading */}
        <Text style={[styles.heading, { color: theme.foreground }]}>
          Customize Profile
        </Text>

        {/* P */}
        <Text style={[styles.text]}>
          Just tap to pick new GIFs and textures. Drag 2, 3, and 4 around as you
          like.
        </Text>
      </View>

      {/* Profile Sticker Editor */}
      <ProfileStickerEditor firstName={profile?.first_name} />

      {/* Right Arrow */}
      <Pressable onPress={handleNext}>
        <Icon name="arrow" fill={theme.foreground} size={40} />
      </Pressable>
    </View>
  );
};
export default CustomizeProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    gap: 20,
  },
  text: {
    color: "white",
    fontFamily: "Poppins-Light",
    fontSize: scaleFontSize(16),
    textAlign: "center",
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
    paddingTop: hp(10),
    lineHeight: 1,
  },
  avatarContainer: {
    width: wp(30),
    aspectRatio: 1,
    borderRadius: wp(20),
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
  },
  headingContainer: {
    alignItems: "center",
    width: wp(80),
  },
});
