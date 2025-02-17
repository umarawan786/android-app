import { StyleSheet, Text, View } from "react-native";
import React from "react";

const HorizontalPadding = ({ padding }) => {
  return <View style={{ paddingHorizontal: padding || 10 }} />;
};

export default HorizontalPadding;
