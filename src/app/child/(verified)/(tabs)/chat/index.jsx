import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import HeaderBar from "@/components/HeaderBar";
import DisplayFriends from "@/components/DisplayFriends/DisplayFriends";
import { useRouter } from "expo-router";

const ChatHome = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const rightIconPress = () => {
    console.log("pressed")
    router.push("/child/(verified)/notifications");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <HeaderBar rightIconPress={rightIconPress} />

      {/* Render all friends */}
      <DisplayFriends />
    </View>
  );
};

export default ChatHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
