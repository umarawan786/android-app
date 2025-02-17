import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useMyFriends } from "../../api/friends";
import { useTheme } from "../../providers/ThemeProvider";
import { hp, scaleFontSize, wp } from "../../helpers/common";
import { FlashList } from "@shopify/flash-list";
import Icon from "../../icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import RenderFriendCard from "./RenderFriendCard";
import { useQueryClient } from "@tanstack/react-query";

const DisplayFriends = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { data, isPending, error } = useMyFriends();
  const { theme } = useTheme();
  const { profile } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (error) {
    console.error(error);
  }

  const handleAdd = () => {
    router.push("/child/(verified)/(tabs)/chat/add_friend");
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries(["friends", profile.id]);
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={[styles.heading, { color: theme.foreground }]}>
          Friends
        </Text>
        {isPending && <ActivityIndicator color={theme.foreground} />}
        {data && (
          <View
            style={{
              width: wp(80),
              height: 400,
              borderColor: "white",
              borderWidth: 1,
            }}
          >
            <FlashList
              data={data}
              ListEmptyComponent={() => (
                <Text
                  style={[
                    styles.poppinsRegular16,
                    styles.txtCentered,
                    { color: theme.foreground },
                  ]}
                >
                  No friends yet
                </Text>
              )}
              renderItem={({ item }) => <RenderFriendCard item={item} />}
              estimatedItemSize={100}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          </View>
        )}
      </View>
      <Pressable onPress={handleAdd} style={styles.bottom}>
        <Icon name={"plus"} size={42} fill={theme.foreground} />
      </Pressable>
    </View>
  );
};

export default DisplayFriends;

const styles = StyleSheet.create({
  container: {
    // borderColor: "white",
    // borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
    height: hp(70),
    marginVertical: 20,
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(32),
    textAlign: "center",
  },
  top: {
    flex: 9,
    // borderColor: "white",
    // borderWidth: 1,
    width: "100%",
    alignItems: "center",
  },
  bottom: {
    flex: 1,
    // borderColor: "white",
    // borderWidth: 1,
    justifyContent: "center",
  },

  // utility styles
  poppinsRegular16: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(16),
  },

  txtCentered: {
    textAlign: "center",
  },
});
