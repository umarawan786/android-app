import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { scaleFontSize, wp } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router";
import { Button } from "@rneui/themed";
import Icon from "@/icons/index";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "@/components/BackButton";
import { checkOTP, deleteOTP } from "@/api/otp";
import { sendFriendRequest } from "./barcode_scanner";

const AddFriend = () => {
  const [otp, setOtp] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState({ minutes: 15, seconds: 0 });
  const [loading, setLoading] = React.useState(false);
  const otpInput = React.useRef("");

  const { theme } = useTheme();
  const { profile } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const { top } = useSafeAreaInsets();

  const router = useRouter();

  React.useEffect(() => {
    console.log("OTP: ", otp);
  }, [otp]);

  React.useEffect(() => {
    // const channel = supabase
    //   .channel("otp_requests:update")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "UPDATE",
    //       schema: "public",
    //       table: "otp_requests",
    //     },
    //     async (payload) => {
    //       console.log(payload.new);
    //       console.log(
    //         payload.new.expires_at,
    //         new Date(Date.now()).toISOString(),
    //         payload.new.expires_at <= new Date(Date.now()).toISOString(),
    //         "cond1"
    //       );
    //       console.log(
    //         payload.new.otp,
    //         otp.otp,
    //         payload.new.otp === otp,
    //         "cond2"
    //       );
    //       if (
    //         payload.new.expires_at <= new Date(Date.now()).toISOString() &&
    //         payload.new.otp === otp.otp
    //       ) {
    //         console.error("expired. deleting");
    //       }
    //     }
    //   )
    //   .subscribe();
    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, []);

  React.useEffect(() => {
    if (!otp) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [otp]);

  const calculateTimeLeft = () => {
    if (!otp) return { minutes: 0, seconds: 0 };

    const expiryTime = new Date(otp.expires_at).getTime();
    const currentTime = new Date().getTime();
    const timeLeft = expiryTime - currentTime;

    if (timeLeft > 0) {
      return {
        minutes: Math.floor((timeLeft / 1000 / 60) % 60),
        seconds: Math.floor((timeLeft / 1000) % 60),
      };
    } else {
      setOtp(null);
      return { minutes: 0, seconds: 0 };
    }
  };

  const handleOTPGeneration = async () => {
    try {
      const newOTP = await generateOTP(profile.id);
      setOtp(newOTP[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScan = () => {
    router.push("/child/(verified)/(tabs)/chat/barcode_scanner");
  };

  const handleGoPressed = async () => {
    setLoading(true);
    try {
      if (otpInput.current.length !== 8) {
        throw new Error("Invalid OTP");
      }
      let code = Number.parseInt(otpInput.current);

      const data = await checkOTP(code);

      if (data.length === 0) {
        throw new Error("Invalid OTP");
      }

      await deleteOTP(code);

      const insertData = await sendFriendRequest(data[0].sender_id, profile.id);
      setLoading(false);
      router.replace({
        pathname: "/child/chat/request_status",
        params: {
          request_id: insertData[0].id,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingTop: top + 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackButton fill={theme.foreground} size={32} />
        <Text
          style={[
            styles.poppinsBold32,
            styles.txtCentered,
            { color: theme.foreground, marginHorizontal: "auto" },
          ]}
        >
          Add Friend
        </Text>
      </View>
      <ScrollView>
        <View
          style={[
            styles.container,
            {
              paddingBottom: tabBarHeight * 2,
            },
          ]}
        >
          <Button
            disabled={loading}
            buttonStyle={[
              {
                backgroundColor: theme.foreground,
                color: theme.background,
                borderRadius: 12,
                height: 50,
                marginVertical: 20,
                paddingHorizontal: 20,
                alignSelf: "flex-end",
              },
            ]}
            onPress={handleScan}
            title={"Scan Friends Code"}
            titleStyle={[styles.poppinsBold20, { color: theme.background }]}
            onLongPress={() => {
              console.log("Long press");
            }}
          />

          {/* OTP Input container */}
          <View style={styles.otpInputContainer}>
            <TextInput
              defaultValue=""
              onChangeText={(text) => (otpInput.current = text)}
              placeholder="Enter Code"
              style={[
                styles.poppinsRegular16,
                {
                  backgroundColor: theme.foreground,
                  color: theme.background,
                  height: 50,
                  flex: 8,
                  opacity: 0.6,
                  borderRadius: 12,
                  paddingHorizontal: 10,
                },
              ]}
            />
            <Pressable
              onPress={handleGoPressed}
              style={[
                {
                  flex: 2,
                  backgroundColor: theme.foreground,
                  color: theme.background,
                  borderRadius: 12,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
              disabled={loading}
            >
              <Text
                style={[
                  styles.poppinsBold20,
                  styles.txtCentered,
                  { color: theme.background },
                ]}
              >
                {loading ? <ActivityIndicator size={"small"} /> : "Go"}
              </Text>
            </Pressable>
          </View>

          {/* Rest */}

          <Pressable
            style={[
              {
                backgroundColor: theme.foreground,
                color: theme.background,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                width: "80%",
                marginVertical: 20,
              },
            ]}
            onPress={handleOTPGeneration}
          >
            <Text style={[styles.poppinsBold20, { color: theme.background }]}>
              Generate Code
            </Text>
          </Pressable>

          {otp && (
            <View>
              <Text style={{ color: theme.foreground }}>
                Your OTP: {otp.otp}
              </Text>
              <Text style={{ color: theme.foreground }}>
                Expires in {timeLeft.minutes} minutes {timeLeft.seconds} seconds
              </Text>
            </View>
          )}

          {/* QR Code */}

          {otp && (
            <View
              style={{
                marginVertical: 10,
                width: "100%",
                alignItems: "center",
              }}
            >
              <QRCode
                value={otp.otp}
                size={250}
                backgroundColor={theme.background}
                color={theme.foreground}
              />
            </View>
          )}

          {/* <View
              style={{
                backgroundColor: "crimson",
                height: 200,
                width: 100,
                marginVertical: 20,
              }}
            /> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddFriend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  otpInputContainer: {
    flexDirection: "row",
    width: "80%",
    gap: 5,
  },

  // utility styles
  poppinsRegular16: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(16),
  },
  poppinsBold32: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(32),
  },
  poppinsBold20: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(20),
  },
  txtCentered: {
    textAlign: "center",
  },
});

export const generateOTP = async (senderId) => {
  const otp = Math.floor(10000000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(new Date().getTime() + 15 * 60000); // 15 minutes expiration

  const { data, error } = await supabase
    .from("otp_requests")
    .insert([{ sender_id: senderId, otp, expires_at: expiresAt }])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data; // Display OTP to the sender
};
