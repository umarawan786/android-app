import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import ListEmptyComponent from "./ListEmptyComponent";
import MessageBubble from "./MessageBubble";
import PostInput from "./PostInput";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  useInsertMessage,
  useMessages,
  useReportMessage,
} from "../../api/chats";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "../../providers/AuthProvider";

const dummyMessage = [
  // PostInput,
  {
    id: "1",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "Hi Lucy! How's it going?",
    text_color: "#FF0000",
  },
  {
    id: "2",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "I'm ok just doing some homework. How are you doing?",
    text_color: "#00FF00",
  },
  {
    id: "3",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "How do you do that maths bit again?",
    text_color: "#0000FF",
  },
  {
    id: "4",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content:
      "Some really long text message. Some really long text message. Some really long text message. Some really long text message. Some really long text message.",
    text_color: "#456DCA",
  },
  {
    id: "5",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content:
      "Some really long text message. Some really long text message. Some really long text message. Some really long text message. Some really long text message.",
    text_color: "#456DCA",
  },
  {
    id: "6",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "hello",
    text_color: "#456DCA",
  },
  {
    id: "7",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "hello",
    text_color: "#456DCA",
  },
  {
    id: "8",
    created_at: "2025-02-03",
    chat_id: "1",
    sender_id: "2",
    content: "hello",
    text_color: "#456DCA",
  },
];

const ChatMessages = ({ chatroom_id }) => {
  const bottomTabBarHeight = useBottomTabBarHeight();

  const { data, isPending, error } = useMessages(chatroom_id);
  const { mutate } = useInsertMessage();

  const { theme } = useTheme();
  const { profile } = useAuth();

  const handleSend = (msg, text_color = "#000000") => {
    mutate(
      {
        chat_id: chatroom_id,
        sender_id: profile.id,
        content: msg,
        text_color,
      },
      {
        onError: (error) => {
          console.error("Failed to send msg. error:", error);
          Alert.alert("Failed to send message. Please try again");
        },
      }
    );
  };

  if (isPending) {
    return (
      <View style={[styles.container, { paddingBottom: bottomTabBarHeight }]}>
        <ActivityIndicator size={"large"} color={theme.foreground} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingBottom: bottomTabBarHeight }]}>
        <Text style={{ fontFamily: "Poppins-Regular", color: "red" }}>
          Failed to load messages please try again
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomTabBarHeight }]}>
      <FlashList
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(item) => item.id.toString()}
        data={data || []}
        renderItem={({ item }) => (
          <MessageBubble item={item} chatroom_id={chatroom_id} />
        )}
        inverted={data?.length > 0}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <PostInput handleSend={handleSend} />
    </View>
  );
};

const Dummy = ({ text = "Header" }) => {
  return (
    <View style={{ backgroundColor: "white", height: 100 }}>
      <Text>{text}</Text>
    </View>
  );
};

export default ChatMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
  },
});
