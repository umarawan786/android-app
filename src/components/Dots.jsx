import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { range, wp } from "../helpers/common";

const Dots = ({ number, highlighted, color, width, dimOpacity = 0.6 }) => {
  return (
    <View style={styles.dotsContainer}>
      {range(1, number + 1).map((n) => (
        <View
          key={n}
          style={[
            styles.dots,
            {
              width: width,
              borderRadius: width / 2,
              backgroundColor: color,
              opacity: highlighted === n ? 1 : dimOpacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default Dots;

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dots: {
    aspectRatio: 1,
  },
});
