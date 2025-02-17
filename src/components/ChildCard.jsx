import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Avatar from "./Avatar";
import { wp, hp, scaleFontSize } from "../helpers/common";

const ChildCard = ({ first_name, avatar_file_location }) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          location={avatar_file_location}
          imageStyles={{ borderRadius: 12 }}
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.text}>{first_name}</Text>
      </View>
    </View>
  );
};

export default ChildCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: wp(80),
    height: hp(12),
    borderRadius: 12,
    flexDirection: "row",
    padding: 10,
    gap: 10,
  },
  avatarContainer: {
    flex: 1,
    borderRadius: 12,
  },
  rightContainer: {
    flex: 2,
    borderRadius: 12,
  },
  text: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(18),
  },
});
