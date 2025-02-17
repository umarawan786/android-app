import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { scaleFontSize, wp } from "../helpers/common";

const FamilyTitle = ({ familyName }) => {
  return (
    <View style={styles.container}>
      {!familyName ? (
        <Text style={styles.familyNameText}>Not Set</Text>
      ) : (
        <Text style={styles.familyNameText}>{familyName}</Text>
      )}
    </View>
  );
};

export default FamilyTitle;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    width: wp(85),
  },
  familyNameText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: scaleFontSize(32),
  },
});
