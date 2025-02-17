import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const notifications = () => {
  const { notification_id, notification_type } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Text>Guardian Notifications</Text>
      {notification_id && <Text>{notification_id}</Text>}
      {notification_type && <Text>{notification_type}</Text>}
    </View>
  );
};

export default notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
