import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

import { useAuth } from "../../providers/AuthProvider";
import { Redirect, useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

const index = () => {
  const { profile } = useAuth();

  // TODO: simplify this
  if (profile.video_uploaded) {
    console.log(
      "Video Uploaded. checking onboarding status",
      profile.onboarding_complete
    );
    if (profile.onboarding_complete) {
      console.log("Onboarding complete, stay on this");
    } else {
      console.log("Taking to child account creation screens");
      return (
        <Redirect href={"/guardian/(child_accounts)/create_child_account"} />
      );
    }
  } else {
    console.log(
      "still needs to upload video declaration. routing to those screens"
    );
    return <Redirect href={"/guardian/(video)/upload_video_declaration"} />;
  }

  return <VerificationScreen />;
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});

const VerificationScreen = () => {
  const { profile, isLoading, signOut } = useAuth();

  if (isLoading || !profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile.verified) {
    return (
      <View style={styles.container}>
        <Text>We are still verifying your profile</Text>
        <Button title="Sign Out" onPress={signOut} />
      </View>
    );
  }

  return <Redirect href={"/guardian/(verified)/"} />;
};
