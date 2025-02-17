import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

import { useTheme } from "@/providers/ThemeProvider";
import BackButton from "@/components/BackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scaleFontSize, wp } from "@/helpers/common";
import { useFriendRequestData } from "@/api/friend_requests";
import { Button } from "@rneui/themed";
import { useQueryClient } from "@tanstack/react-query";
import Avatar from "@/components/Avatar";

const request_status = () => {
  const { request_id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();

  const { data, isLoading, error } = useFriendRequestData(request_id);

  const queryClient = useQueryClient();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: top + 40 },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackButton fill={theme.foreground} size={32} />
        <Text
          style={[
            styles.poppinsBold32,
            {
              color: theme.foreground,
              marginHorizontal: "auto",
              textTransform: "capitalize",
            },
          ]}
        >
          {isLoading && (
            <ActivityIndicator size="large" color={theme.foreground} />
          )}
          {!isLoading && !error && data[1].status}
        </Text>
      </View>

      {isLoading && (
        <ActivityIndicator size={"large"} color={theme.foreground} />
      )}

      {!isLoading && !error && data[0] && (
        <ShowRequestData data={data[0]} theme={theme} status={data[1].status} />
      )}

      <Button
        title={"Refresh"}
        onPress={() => {
          queryClient.invalidateQueries(["request", request_id]);
        }}
        buttonStyle={{
          backgroundColor: theme.foreground,
        }}
        titleStyle={{
          color: theme.background,
        }}
      />
    </View>
  );
};

export default request_status;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  poppinsBold32: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(32),
  },
});

const ShowRequestData = ({ data, theme, status }) => {
  return (
    <View style={requestStatusStyles.container}>
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 80 }}>
        <Text style={[requestStatusStyles.name, { color: theme.foreground }]}>
          {data[0].first_name}
        </Text>
        <Text style={[requestStatusStyles.name, { color: theme.foreground }]}>
          {data[1].first_name}
        </Text>
      </View>
      <View style={requestStatusStyles.topContainer}>
        <View style={requestStatusStyles.avatarContainer}>
          <Avatar location={data[0].avatar_file_location} />
        </View>
        <View>
          <Text style={[requestStatusStyles.name, { color: theme.foreground }]}>
            {"<    >"}
          </Text>
        </View>
        <View style={requestStatusStyles.avatarContainer}>
          <Avatar location={data[0].avatar_file_location} />
        </View>
      </View>

      <View>
        <Text style={[requestStatusStyles.status, { color: theme.foreground }]}>
          {status === "pending"
            ? "Your friend request is pending approval."
            : status === "approved"
            ? "Congratulations! You are now connected on Liaura."
            : "Unfortunately, your friend request was rejected."}
        </Text>
      </View>
    </View>
  );
};

const requestStatusStyles = StyleSheet.create({
  container: {
    // borderColor: "white",
    // borderWidth: 1,
    width: wp(100),
    height: 600,
    paddingTop: 40,
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  avatarContainer: {
    borderWidth: 1,
    borderColor: "white",
    width: 100,
    borderRadius: "50%",
    aspectRatio: 1,
  },

  name: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(32),
  },
  status: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(20),
  },
});
