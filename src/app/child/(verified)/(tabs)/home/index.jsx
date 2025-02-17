import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import HeaderBar from "@/components/HeaderBar";
import { useRouter } from "expo-router";
import { Button } from "@rneui/themed";
import { useAuth } from "@/providers/AuthProvider";
import { useInsertMessage } from "../../../../../api/chats";

const ChildHomeScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const { signOut, profile } = useAuth();

  const rightIconOnPress = () => {
    router.push("/child/(verified)/notifications");
  };

  const chatroom_id = "446c5830-5da7-415d-a54e-9a9383dc03ca";

  const { mutate, isPending, error } = useInsertMessage();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <HeaderBar rightIconOnPress={rightIconOnPress} />

      <Button
        title={"Test mutation"}
        onPress={() => {
          mutate({
            chat_id: chatroom_id,
            sender_id: profile.id,
            text_color: "#555555",
            content: "some message",
          });
        }}
      />

      <Button title={"Log out"} onPress={signOut} />
    </View>
  );
};

export default ChildHomeScreen;

const styles = StyleSheet.create({});
