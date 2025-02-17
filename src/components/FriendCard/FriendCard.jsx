umaimport { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";

import Avatar from "@/components/Avatar";
import { useProfile } from "../../api/profile";
import { useFriendsGifs } from "../../api/profileGifs";
import { Image } from "expo-image";

const FriendCard = ({ friendId, theme }) => {
  const { data, isPending, error } = useProfile(friendId);
  const {
    data: friendsGifs,
    isPending: friendsGifsPending,
    error: friendsGifsError,
  } = useFriendsGifs(friendId);

  if (isPending || friendsGifsPending) {
    return (
      <View style={[styles.container, { backgroundColor: theme.foreground }]}>
        <ActivityIndicator size={"large"} color={theme.background} />
      </View>
    );
  }

  if (error || friendsGifsError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.foreground }]}>
        <Text style={styles.errorText}>
          {error ? "Failed to load user data." : "Failed to load GIFs."}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.foreground }]}>
      <View style={styles.avatarContainer}>
        <Avatar
          location={data.avatar_file_location}
          imageStyles={styles.avatar}
        />
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.rLeftContainer}>
          <Text>{data.first_name}</Text>
          <View style={styles.gifOneContainer}>
            <Image source={friendsGifs.one} style={styles.gif} />
          </View>
        </View>
        <View style={styles.rRightContainer}>
          <View style={styles.gifOneContainer}>
            <Image source={friendsGifs.three} style={styles.gif} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    height: 100,
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderRadius: 5,
  },
  avatarContainer: {
    flex: 4,
    borderRadius: 5,
    overflow: "hidden",
  },
  rightContainer: {
    flex: 6,
    flexDirection: "row",
    gap: 5,
  },
  rLeftContainer: {
    flex: 7,
  },
  rRightContainer: {
    flex: 3,
    justifyContent: "center",
  },

  gifOneContainer: {
    width: 50,
    height: 50,
  },
  gif: {
    width: "100%",
    height: "100%",
  },
  avatar: {
    borderRadius: 0,
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    color: "red",
    fontSize: 14,
    textAlign: "center",
  },
});
