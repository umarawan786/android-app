import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import { hexToRGBA } from "../helpers/colors";

const CustomButton = ({
  containerStyles,
  onPress,
  title,
  titleStyles,
  ...props
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        containerStyles,
        props.style,
        props.disabled && {
          backgroundColor: hexToRGBA(theme.colors.mint, 0.1),
        },
      ]}
    >
      <Text style={titleStyles}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
