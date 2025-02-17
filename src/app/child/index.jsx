import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";
import { Redirect } from "expo-router";

const index = () => {
  const { profile, isLoading, signOut } = useAuth();

  if (isLoading || !profile) {
    return (
      <View style={styles.container}>
        <Text>loading...</Text>
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

  if (!profile.onboarding_complete) {
    return <Redirect href={"/child/onboarding/theme_color_selection"} />;
  }

  // else take them to (verified)/...
  return <Redirect href={"/child/(verified)/"} />;
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
