import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

import { useAvatarSignedUrl } from "../api/storage/avatars";
import { AVATAR_TTL } from "../constants/queryttl";

const Avatar = ({ location, imageStyles }) => {
  const {
    data: signedUrl,
    isPending,
    isError,
    error,
  } = useAvatarSignedUrl(location, AVATAR_TTL);

  if (isPending) {
    return <ActivityIndicator color={"white"} />;
  }

  if (isError) {
    <View>
      <Text style={styles.text}>Error fetching: {error.message}</Text>
    </View>;
  }

  return (
    <Image
      source={{ uri: signedUrl }}
      style={{ ...styles.avatar, ...imageStyles }}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 32,
    color: "black",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});
