import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = (percentage) => (percentage * deviceHeight) / 100;

export const wp = (percentage) => (percentage * deviceWidth) / 100;

export const scaleFontSize = (size) => (deviceWidth < 400 ? size * 0.8 : size);

export const range = (start, end, step = 1) => {
  let output = [];

  if (typeof end === "undefined") {
    end = start;
    start = 0;
  }

  for (let i = start; i < end; i += step) {
    output.push(i);
  }

  return output;
};
