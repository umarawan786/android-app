import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";

import { useTheme } from "@/providers/ThemeProvider";
import { scaleFontSize } from "@/helpers/common";
import { hexToRGBA } from "@/helpers/colors";
import Icon from "../../icons";
import ColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
} from "reanimated-color-picker";
import { Button } from "@rneui/themed";
import { ReportingTooltip as Tooltip } from "./ReportingTooltip";

const PostInput = ({ handleSend }) => {
  const [message, setMessage] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);
  const [color, setColor] = React.useState("#000000");

  const { theme } = useTheme();

  const overlayColor = React.useMemo(
    () => hexToRGBA(theme.background, 0.6),
    [theme]
  );

  const handleSendPressed = () => {
    if (message.trim()) {
      handleSend(message, color);
      setMessage("");
    }
  };

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    setColor(hex);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.foreground }]}>
      <TextInput
        style={[styles.input, { color: color || theme.background }]}
        placeholder="Write your message"
        value={message}
        onChangeText={setMessage}
      />
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Tooltip
          popover={
            <ColorPicker
              style={{ width: "70%" }}
              value="red"
              onComplete={onSelectColor}
            >
              <Preview />
              <Panel1 />
              <HueSlider />
              <Swatches />
            </ColorPicker>
          }
          width={300}
          height={550}
          backgroundColor={theme.foreground}
          overlayColor={overlayColor}
          skipAndroidStatusBar={true}
        >
          <Icon name={"rainbow"} stroke={theme.background} size={32} />
        </Tooltip>
      </View>

      <Pressable onPress={handleSendPressed} style={[styles.justifyCenter]}>
        <Icon name={"arrow"} fill={theme.background} size={32} />
      </Pressable>
    </View>
  );
};

export default PostInput;

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginVertical: 10,
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(18),
  },
  rainboxContainer: {
    alignSelf: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
});
