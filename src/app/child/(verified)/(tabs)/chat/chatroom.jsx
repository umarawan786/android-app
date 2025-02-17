import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

import { useTheme } from "@/providers/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { Button, SearchBar } from "@rneui/themed";

import { hexToRGBA } from "@/helpers/colors";
import Icon from "../../../../../icons";
import { useChatRoomInfo } from "../../../../../api/chats";
import { useQueryClient } from "@tanstack/react-query";
import FriendCard from "../../../../../components/FriendCard/FriendCard";
import { useAuth } from "../../../../../providers/AuthProvider";
import ChatMessages from "../../../../../components/ChatMessages/ChatMessages";

const ChatRoom = () => {
  const { chatroom_id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const { profile } = useAuth();

  const { data, isPending, error } = useChatRoomInfo(chatroom_id || "");
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");

  if (!chatroom_id) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.background, paddingTop: top + 10 },
        ]}
      >
        <Text>Not found</Text>
      </View>
    );
  }

  const searchPlaceholderColor = React.useMemo(
    () => hexToRGBA(theme.foreground, 0.8),
    [theme]
  );

  const handleSearchPress = () => {
    console.log("Searching with", search);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: top + 10 },
      ]}
    >
      {/* Header */}
      <View>
        <BackButton fill={theme.foreground} size={32} />
        <Text style={[styles.title, { color: theme.foreground }]}></Text>
      </View>

      {/* SearchBar */}
      <View style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
        <SearchBar
          placeholder="Search chat"
          placeholderTextColor={searchPlaceholderColor}
          onChangeText={setSearch}
          value={search}
          lightTheme
          containerStyle={styles.searchContainer}
          inputContainerStyle={[
            styles.inputContainer,
            {
              backgroundColor: theme.background,
              borderColor: theme.foreground,
            },
          ]}
          inputStyle={[styles.inputText, { color: theme.foreground }]}
          searchIcon={
            <Pressable onPress={handleSearchPress}>
              <Icon name={"search"} size={20} fill={theme.foreground} />
            </Pressable>
          }
          clearIcon={
            <Pressable onPress={() => setSearch("")}>
              <Icon name={"x"} size={20} fill={theme.foreground} />
            </Pressable>
          }
        />
      </View>

      {isPending && (
        <View>
          <ActivityIndicator size={"large"} color={theme.foreground} />
        </View>
      )}

      {/* If it is not a group chat then show friend card */}
      {data && !data.chat_info.is_group && (
        <FriendCard
          theme={theme}
          friendId={
            data.participants.find(({ user_id }) => user_id !== profile.id)
              ?.user_id
          }
        />
      )}

      {/* Else for now just skip it */}
      {/* Show Chat messages */}
      <ChatMessages chatroom_id={chatroom_id} />

      {/* <Button
        title={"Invalidate"}
        onPress={() => queryClient.invalidateQueries(["chatroom", chatroom_id])}
      /> */}
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: "red",
    borderWidth: 1,
  },
  title: {
    marginHorizontal: "auto",
    fontFamily: "Poppins-Bold",
    fontSize: 15,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  inputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 1, // For some odd reason, rneui was overriding this
    height: 60,
  },
  inputText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
});
