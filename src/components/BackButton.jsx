import { Pressable, StyleSheet } from "react-native";
import React from "react";

import Icon from "@/icons";
import { useRouter } from "expo-router";

const BackButton = ({ fill, size }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <Pressable style={styles.container} onPress={handleBack}>
      <Icon name="back2" fill={fill || "black"} size={size || 32} />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    position: "absolute",
  },
});
