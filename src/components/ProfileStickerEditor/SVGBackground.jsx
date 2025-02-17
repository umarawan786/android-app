import React from "react";
import Svg, { Path, G } from "react-native-svg";

const SVGComponent = (props) => {
  const {
    width = 500,
    height = 200,
    stroke = "white",
    strokeWidth = 5,
    borderRadius = 20,
  } = props;

  //   console.log("SVGComponent called, props are:");
  //   console.log(
  //     JSON.stringify(
  //       {
  //         width,
  //         height,
  //         stroke,
  //         strokeWidth,
  //       },
  //       null,
  //       2
  //     )
  //   );

  const strokeDasharray = "0 20"; // <length of dash> <gap between dashes>
  const viewBox = `0 0 ${width} ${height}`;

  const BOTTOM_LEFT = {
    width: 0.6 * width,
    height: 0.4 * height,
    coordinates: {
      x_left: 0,
      x_right: 0.6 * width,
      y_top: 0.55 * height,
      y_bottom: 0.95 * height,
    },
  };

  const TOP_LEFT = {
    width: 0.35 * width,
    height: 0.4 * height,
    coordinates: {
      x_left: 0,
      x_right: 0.35 * width,
      y_top: 0.05 * height,
      y_bottom: 0.45 * height,
    },
  };

  const BOTTOM_RIGHT = {
    width: 0.35 * width,
    height: 0.4 * height,
    coordinates: {
      x_left: 0.65 * width,
      x_right: width,
      y_top: 0.55 * height,
      y_bottom: 0.95 * height,
    },
  };

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
      viewBox={viewBox}
      width={width}
      height={height}
    >
      {/* Bottom Left */}
      <G>
        {/* Starts from bottom and constructs towards the top, anti clockwise */}
        <Path
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={"round"}
          strokeDasharray={strokeDasharray}
          d={`M ${BOTTOM_LEFT.coordinates.x_left} ${
            BOTTOM_LEFT.coordinates.y_bottom
          } L ${BOTTOM_LEFT.width / 2} ${BOTTOM_LEFT.coordinates.y_bottom}`}
        />
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          d={`M ${BOTTOM_LEFT.width / 2} ${
            BOTTOM_LEFT.coordinates.y_bottom
          } L ${BOTTOM_LEFT.coordinates.x_right - borderRadius} ${
            BOTTOM_LEFT.coordinates.y_bottom
          } C ${BOTTOM_LEFT.coordinates.x_right},${
            BOTTOM_LEFT.coordinates.y_bottom
          } ${BOTTOM_LEFT.coordinates.x_right},${
            BOTTOM_LEFT.coordinates.y_bottom
          } ${BOTTOM_LEFT.coordinates.x_right},${
            BOTTOM_LEFT.coordinates.y_bottom - borderRadius
          } V ${BOTTOM_LEFT.coordinates.y_bottom - BOTTOM_LEFT.height / 2}`}
        />

        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          strokeDasharray={strokeDasharray}
          d={`M ${BOTTOM_LEFT.coordinates.x_right} ${
            BOTTOM_LEFT.coordinates.y_bottom - BOTTOM_LEFT.height / 2
          } V ${BOTTOM_LEFT.coordinates.y_top + borderRadius} C ${
            BOTTOM_LEFT.coordinates.x_right
          },${BOTTOM_LEFT.coordinates.y_top} ${
            BOTTOM_LEFT.coordinates.x_right
          },${BOTTOM_LEFT.coordinates.y_top} ${
            BOTTOM_LEFT.coordinates.x_right - borderRadius
          },${BOTTOM_LEFT.coordinates.y_top} H ${BOTTOM_LEFT.width / 2} `}
        />
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          d={`M ${BOTTOM_LEFT.width / 2} ${BOTTOM_LEFT.coordinates.y_top} H ${
            BOTTOM_LEFT.coordinates.x_left
          }`}
        />
      </G>

      {/* Top Left */}
      <G>
        {/* Start from the top and construct clockwise */}
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          strokeDasharray={strokeDasharray}
          d={`M ${TOP_LEFT.coordinates.x_left} ${
            TOP_LEFT.coordinates.y_top
          } H ${TOP_LEFT.coordinates.x_right - borderRadius} C ${
            TOP_LEFT.coordinates.x_right
          },${TOP_LEFT.coordinates.y_top} ${TOP_LEFT.coordinates.x_right},${
            TOP_LEFT.coordinates.y_top
          } ${TOP_LEFT.coordinates.x_right},${
            TOP_LEFT.coordinates.y_top + borderRadius
          } V ${TOP_LEFT.coordinates.y_top + TOP_LEFT.height / 2}`}
        />
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          d={`M ${TOP_LEFT.coordinates.x_right} ${
            TOP_LEFT.coordinates.y_top + TOP_LEFT.height / 2
          } V ${TOP_LEFT.coordinates.y_bottom - borderRadius} C ${
            TOP_LEFT.coordinates.x_right
          },${TOP_LEFT.coordinates.y_bottom} ${TOP_LEFT.coordinates.x_right},${
            TOP_LEFT.coordinates.y_bottom
          } ${TOP_LEFT.coordinates.x_right - borderRadius},${
            TOP_LEFT.coordinates.y_bottom
          } H ${TOP_LEFT.coordinates.x_left}`}
        />
      </G>

      {/* Bottom Right */}
      <G>
        {/* Start from top right and construct anticlockwise */}
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          d={`M ${BOTTOM_RIGHT.coordinates.x_right} ${
            BOTTOM_RIGHT.coordinates.y_top
          } H ${BOTTOM_RIGHT.coordinates.x_left + borderRadius}
          C ${BOTTOM_RIGHT.coordinates.x_left},${
            BOTTOM_RIGHT.coordinates.y_top
          } ${BOTTOM_RIGHT.coordinates.x_left},${
            BOTTOM_RIGHT.coordinates.y_top
          } ${BOTTOM_RIGHT.coordinates.x_left},${
            BOTTOM_RIGHT.coordinates.y_top + borderRadius
          } V ${BOTTOM_RIGHT.coordinates.y_top + BOTTOM_RIGHT.height / 2} 
          `}
        />
        <Path
          stroke={props.stroke || "white"}
          strokeWidth={props.strokeWidth || 5}
          strokeLinecap={"round"}
          strokeDasharray={strokeDasharray}
          d={`M ${BOTTOM_RIGHT.coordinates.x_left} ${
            BOTTOM_RIGHT.coordinates.y_top + BOTTOM_RIGHT.height / 2
          } V ${BOTTOM_RIGHT.coordinates.y_bottom - borderRadius}
          C ${BOTTOM_RIGHT.coordinates.x_left},${
            BOTTOM_RIGHT.coordinates.y_bottom
          } ${BOTTOM_RIGHT.coordinates.x_left},${
            BOTTOM_RIGHT.coordinates.y_bottom
          } ${BOTTOM_RIGHT.coordinates.x_left + borderRadius},${
            BOTTOM_RIGHT.coordinates.y_bottom
          } H ${BOTTOM_RIGHT.coordinates.x_right}
          `}
        />
      </G>
    </Svg>
  );
};

export default SVGComponent;
