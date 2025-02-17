import React from "react";
import { Text, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import { useNotificationsContext } from "../providers/NotificationsProvider";
import { Redirect } from "expo-router";

import * as LocalAuthentication from "expo-local-authentication";

import LoadingModal from "../components/LoadingModal";

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  const { session, profile, isLoading } = useAuth();
  const { notifications, expoPushToken, error } = useNotificationsContext;

  if (error) {
    console.error(error);
  }

  console.log(JSON.stringify(notifications, null, 2));
  // console.log("Expo push token", expoPushToken);

  const handleBiometricAuth = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      // console.log("Biometric authentication not available");
      setIsAuthenticated(true); // Proceed without local auth
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      // console.log("No biometrics enrolled");
      setIsAuthenticated(true); // Proceed without local authentication
      return;
    }

    // Else prompt the user for local authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to continue",
      fallbackLabel: "Use passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      setIsAuthenticated(true);
    } else {
      console.log("Authentication failed");
    }
  };

  console.log("src/index rendered");

  React.useEffect(() => {
    if (session) {
      handleBiometricAuth();
    }
  }, []);

  if (isLoading) {
    return <LoadingModal task="index: loading" />;
  }

  if (!session) {
    console.log("no session");
    return <Redirect href={"/signup"} />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (profile?.role === "child") {
    return <Redirect href={"/child"} />;
  }

  if (profile?.role === "guardian") {
    return <Redirect href={"/guardian"} />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
