import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { scaleFontSize, wp } from "../../helpers/common";
import { useTheme } from "../../providers/ThemeProvider";
import { useAuth } from "../../providers/AuthProvider";
import { Image } from "expo-image";

import Avatar from "@/components/Avatar";
import Icon from "../../icons";
import { useRouter } from "expo-router";
import { useCreateNewChatRoom } from "../../api/chats";
import { FriendActionButton } from "./FriendActionButton";

const RenderFriendCard = ({ item }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { profile } = useAuth();

  const {
    mutate,
    error,
    isSuccess,
    isPending,
    data: chatroom_id,
  } = useCreateNewChatRoom();

  React.useEffect(() => {
    console.log("Mutation Error:", error);
  }, [error]);

  React.useEffect(() => {
    if (isSuccess && chatroom_id) {
      router.push({
        pathname: "/child/chat/chatroom",
        params: {
          chatroom_id,
        },
      });
    }
  }, [isSuccess, chatroom_id]);

  const handleMessagePressed = async () => {
    // Create a chat room if it does not already exists
    console.log("message pressed");

    mutate({
      title: item.first_name,
      isGroup: false,
      participants: [profile.id, item.id],
    });
  };
  return (
    <View style={[styles.container, { backgroundColor: theme.foreground }]}>
      {/* Left */}
      <View style={styles.leftContainer}>
        <Avatar
          location={item.avatar_file_location}
          imageStyles={styles.image}
        />
      </View>

      {/* Right */}
      <View style={styles.rightContainer}>
        <View style={styles.innerLeft}>
          <Text style={[styles.name, { color: theme.background }]}>
            {item.first_name}
          </Text>
          <View style={styles.iconContainer}>
            <Image
              source={item.profile_gifs[0].one}
              style={styles.gif}
              contentFit="fill"
            />
          </View>
          <FriendActionButton
            onPress={() => {
              console.log("profile pressed");
            }}
            text="Profile"
            iconName="profile"
            theme={theme}
          />
        </View>
        <View style={styles.innerRight}>
          <View style={styles.iconContainer}>
            <Image
              source={item.profile_gifs[0].two}
              style={styles.gif}
              contentFit="fill"
            />
          </View>

          <FriendActionButton
            onPress={handleMessagePressed}
            text="Message"
            iconName="arrow"
            isLoading={isPending}
            theme={theme}
          />
        </View>
      </View>
    </View>
  );
};

export default RenderFriendCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
    marginBottom: 5,
  },
  leftContainer: {
    flex: 35,
    borderRadius: 12,
  },

  rightContainer: {
    flex: 65,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  innerLeft: {
    flex: 7,
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  innerRight: {
    flex: 3,
    justifyContent: "space-between",
    paddingVertical: 5,
    alignItems: "flex-end",
    paddingHorizontal: 5,
  },
  iconContainer: {
    width: 25,
    aspectRatio: 1,
  },
  // other
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(20),
  },
  gif: {
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 12,
  },
});
