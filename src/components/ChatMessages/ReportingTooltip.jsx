import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Tooltip } from "@rneui/themed";
import { useReportMessage } from "../../api/chats";
import { useAuth } from "../../providers/AuthProvider";
import { useTheme } from "../../providers/ThemeProvider";

export const ReportingTooltip = (props) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      console.log("Tooltip open");
    }
  }, [open]);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
};

export const TooltipPopover = ({ chatroom_id, message }) => {
  const { mutate, isPending } = useReportMessage();
  const { profile } = useAuth();
  const { theme } = useTheme();

  const handleReport = (msg, reason) => {
    console.log("Reporting", msg, "for", reason);
    mutate(
      {
        reported_by: profile.id,
        chat_id: chatroom_id,
        message_id: msg,
        reason,
      },
      {
        onError: (error) => {
          console.error("Failed to report msg. error:", error);
          Alert.alert("Failed to report message. Please try again");
        },
      }
    );
  };

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={"large"} color={theme.background} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.poppinsRegular14]}>
        Please choose your reason for reporting this message
      </Text>

      <View>
        {REPORTING_REASONS.map(({ id, reason }) => (
          <Pressable key={id} onPress={() => handleReport(message.id, reason)}>
            <Text>{reason}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 5,
  },
  poppinsRegular14: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
});

const REPORTING_REASONS = [
  { id: 1, reason: "It's rude" },
  { id: 2, reason: "It upsets me" },
  { id: 3, reason: "It's not true" },
  { id: 4, reason: "I don't understand this" },
  { id: 5, reason: "I don't know who this is" },
];
