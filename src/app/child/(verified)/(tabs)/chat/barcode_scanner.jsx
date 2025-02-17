import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { checkOTP, deleteOTP } from "@/api/otp";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";

const BarcodeScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = React.useState(false);
  const [lastScanned, setLastScanned] = React.useState(null);
  const { profile } = useAuth();
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarcodeScanned = async (barcode) => {
    // console.log("barcode", barcode.data);

    if (barcode.data === lastScanned) {
      return;
    }

    setLoading(true);
    setLastScanned(barcode.data);

    if (barcode?.data) {
      try {
        if (barcode.data.length !== 8) {
          throw new Error("Invalid barcode");
        }
        const code = Number.parseInt(barcode.data);

        // Check if it is valid OTP
        const data = await checkOTP(code);

        if (data.length === 0) {
          throw new Error("Invalid barcode");
        } else {
          // Delete the OTP
          const status = await deleteOTP(code);

          // Create a friend request
          // sender_id = data[0].sender_id
          // receiver_id = profile.id
          const insertData = await sendFriendRequest(
            data[0].sender_id,
            profile.id
          );
          console.log(insertData[0].id, "<<");
          router.replace({
            pathname: "/child/chat/request_status",
            params: {
              request_id: insertData[0].id,
            },
          });
          // router.dismissTo("/child/chat/add_friend");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
        return;
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </View>
  );
};

export default BarcodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
});

export const sendFriendRequest = async (sender_id, receiver_id) => {
  const { data, error: checkError } = await supabase
    .from("friend_requests")
    .select("*")
    .eq("sender_id", sender_id)
    .eq("receiver_id", receiver_id)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError);
  } else if (data) {
    return;
  } else {
    const { data: insertData, error: insertError } = await supabase
      .from("friend_requests")
      .insert({
        sender_id: sender_id,
        receiver_id: receiver_id,
        status: "pending",
      })
      .select();

    if (insertError) {
      throw new Error(insertError);
    }

    return insertData;
  }
};
