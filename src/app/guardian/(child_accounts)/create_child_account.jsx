import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import { scaleFontSize, wp } from "../../../helpers/common";
import { useAuth } from "../../../providers/AuthProvider";
import ChildSignUpForm from "../../../components/forms/ChildSignUpForm";

const CreateChildAccount = () => {
  const { top, bottom } = useSafeAreaInsets();

  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <GradientScreenWrapper>
      <ScrollView style={{ paddingTop: top, paddingBottom: bottom }}>
        <View style={styles.container}>
          {/* Title Text */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Set up Accounts</Text>
          </View>

          {/* Form */}
          <ChildSignUpForm />
        </View>
      </ScrollView>
    </GradientScreenWrapper>
  );
};

export default CreateChildAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    maxWidth: wp(50),
    fontSize: scaleFontSize(32),
    color: "white",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});
