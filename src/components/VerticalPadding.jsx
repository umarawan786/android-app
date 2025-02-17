import { StyleSheet, Text, View } from "react-native";
import React from "react";

const VerticalPadding = ({ padding }) => {
  return <View style={{ paddingVertical: padding || 10 }} />;
};

export default VerticalPadding;
