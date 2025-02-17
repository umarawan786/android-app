import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
  ScrollView,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import GradientScreenWrapper from "../../components/GradientScreenWrapper";
import { scaleFontSize, wp } from "../../helpers/common";
import SignUpForm from "../../components/forms/SignUpForm";
import { Link } from "expo-router";

const SignUp = () => {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <GradientScreenWrapper>
      <ScrollView
        style={{ paddingTop: top, paddingBottom: bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.container, { paddingTop: top, paddingBottom: bottom }]}
          onStartShouldSetResponder={() => true}
          onResponderRelease={Keyboard.dismiss}
        >
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create new Account</Text>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Already registered? </Text>
              <Link asChild href={"/login"}>
                <Pressable style={styles.linkContainer}>
                  <Text style={[styles.subtitle, styles.loginLink]}>
                    Log in here
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {/* Form */}
          <SignUpForm />
        </View>
      </ScrollView>
    </GradientScreenWrapper>
  );
};

export default SignUp;

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
    maxWidth: wp(70),
    fontSize: scaleFontSize(32),
    color: "white",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: scaleFontSize(12),
    fontFamily: "Poppins-Regular",
    color: "white",
    textAlign: "center",
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loginLink: {
    color: "white",
    fontFamily: "Poppins-Bold",
    textDecorationLine: "underline",
  },
});
