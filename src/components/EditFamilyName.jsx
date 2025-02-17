import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import Icon from "../icons";

const EditFamilyName = ({ bottomSheetRef, snapIndex, setSnapIndex }) => {
  const handlePress = () => {
    const newIndex = snapIndex === -1 ? 0 : -1;
    if (newIndex === -1) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(newIndex);
    }
    setSnapIndex(newIndex);
  };

  return (
    <View>
      <Pressable
        style={styles.iconContainer}
        onPress={handlePress}
        hitSlop={10}
      >
        <Icon name={"pencil"} fill="white" />
      </Pressable>
    </View>
  );
};

export default EditFamilyName;

const styles = StyleSheet.create({
  iconContainer: {},
});
