import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import { hp, scaleFontSize, wp } from "@/helpers/common";
import Dots from "@/components/Dots";
import ThemeSelection from "@/components/ThemeSelection/ThemeSelection";
import Icon from "@/icons/index";
import Avatar from "@/components/Avatar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

const ThemeColorSelection = () => {
  const { theme } = useTheme();
  const { profile } = useAuth();

  const router = useRouter();

  const handleNext = () => {
    // store theme in the background
    supabase
      .from("profiles")
      .update({ theme_id: theme.id })
      .eq("id", profile.id)
      .then(({ error }) => {
        if (error) console.error(error);
      });
    router.push("/child/onboarding/customize_profile");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Name Title */}
          <Text style={[styles.text, styles.name, { color: theme.foreground }]}>
            {profile.first_name}
          </Text>

          {/* Avatar Container */}
          <View
            style={[styles.avatarContainer, { borderColor: theme.foreground }]}
          >
            <Avatar
              location={profile?.avatar_file_location}
              imageStyles={{ borderRadius: wp(15) }}
            />
          </View>

          {/* Dots */}
          <Dots
            number={3}
            highlighted={1}
            color={theme.foreground}
            width={wp(4)}
          />

          {/* Heading */}
          <Text style={[styles.heading, { color: theme.foreground }]}>
            Choose Colours
          </Text>

          {/* Theme Selection */}
          <ThemeSelection />

          {/* Right Arrow */}
          <Pressable onPress={handleNext}>
            <Icon name="arrow" fill={theme.foreground} size={40} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default ThemeColorSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    gap: 20,
    paddingBottom: 40,
  },
  text: {
    color: "white",
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
    borderRadius: wp(15),
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
  },
});
