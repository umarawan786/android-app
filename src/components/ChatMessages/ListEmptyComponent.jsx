import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";

import LottieView from "lottie-react-native";

const AlertAnimFile = require("../../../assets/animations/alert.json");

const ListEmptyComponent = () => {
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.foreground }]}>
        No messages to display
      </Text>
      <LottieView autoPlay loop source={AlertAnimFile} style={styles.lottie} />
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  text: {
    fontFamily: "Poppins-Bold",
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
