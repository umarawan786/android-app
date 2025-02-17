import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { scaleFontSize } from "@/helpers/common";
import { hexToRGBA } from "@/helpers/colors";

import Icon from "../../icons";
import { ReportingTooltip, TooltipPopover } from "./ReportingTooltip";
import { useAuth } from "../../providers/AuthProvider";

const MessageBubble = ({ item, chatroom_id }) => {
  const { theme } = useTheme();
  const { profile } = useAuth();

  const ownMessage = profile.id === item.sender_id;

  const overlayColor = React.useMemo(
    () => hexToRGBA(theme.background, 0.6),
    [theme]
  );

  const bubbleBG = hexToRGBA(theme.foreground, ownMessage ? 0.9 : 1);

  if (typeof item === "function") {
    // This is the text input
    const MessageInputField = item;
    return <MessageInputField />;
  }

  if (item.reported) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: bubbleBG },
          ownMessage
            ? { borderBottomRightRadius: 0 }
            : { borderBottomLeftRadius: 0 },
        ]}
      >
        <Text
          style={[styles.text, { color: item.text_color || theme.background }]}
        >
          This message has been reported
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bubbleBG },
        ownMessage
          ? { borderBottomRightRadius: 0 }
          : { borderBottomLeftRadius: 0 },
      ]}
    >
      <Text
        style={[styles.text, { color: item.text_color || theme.background }]}
      >
        {item.content}
      </Text>
      {!ownMessage && (
        <ReportingTooltip
          popover={<TooltipPopover chatroom_id={chatroom_id} message={item} />}
          backgroundColor={theme.foreground}
          overlayColor={overlayColor}
          width={300}
          containerStyle={{ height: 200 }}
        >
          <Icon name={"flag"} />
        </ReportingTooltip>
      )}
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 7,
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(18),
    flex: 1,
  },
});
