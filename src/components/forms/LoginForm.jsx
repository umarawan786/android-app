import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../providers/AuthProvider";
import { theme } from "../../constants/theme";
import { scaleFontSize, wp } from "../../helpers/common";

import { constructChildEmail } from "../../helpers/constructChildEmail";

const LogInForm = () => {
  // TODO: Remove defaults later
  const [loading, setLoading] = useState(false);
  const [isChild, setIsChild] = useState(false);

  const nameRef = useRef("Martins");
  const emailRef = useRef("jiara@gmail.com");
  const passwordRef = useRef("12345678");

  const { signInWithEmail } = useAuth();

  const handlePress = async () => {
    setLoading(true);
    let childEmail;
    if (isChild) {
      childEmail = constructChildEmail(emailRef.current, nameRef.current);
    }
    await signInWithEmail(
      isChild ? childEmail : emailRef.current,
      passwordRef.current
    );
    setLoading(false);
  };

  const toggleIsChild = (pressed) => {
    setIsChild(pressed === "child");
  };

  return (
    <View style={styles.formContainer}>
      {/* Guardian/Child Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable onPress={() => toggleIsChild("guardian")}>
          <Text style={[styles.toggleLink, !isChild && styles.selectedToggle]}>
            Guardian
          </Text>
        </Pressable>
        <Pressable onPress={() => toggleIsChild("child")}>
          <Text style={[styles.toggleLink, isChild && styles.selectedToggle]}>
            Child
          </Text>
        </Pressable>
      </View>

      {isChild && (
        <View style={styles.formInputContainer}>
          <Text style={styles.formInputLabel}>Your Name</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Enter your name"
            defaultValue={nameRef.current}
            onChangeText={(text) => (nameRef.current = text)}
          />
        </View>
      )}

      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Guardian Account Email</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your email"
          defaultValue={emailRef.current}
          onChangeText={(text) => (emailRef.current = text)}
        />
      </View>

      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your password"
          // secureTextEntry
          defaultValue={passwordRef.current}
          onChangeText={(text) => (passwordRef.current = text)}
        />
      </View>

      {/* Next Button */}
      <View style={styles.nextButtonContainer}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 10 }}
        >
          <Pressable style={styles.nextButton} onPress={handlePress}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.nextButtonText}>Log In</Text>
            )}
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
};

export default LogInForm;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toggleLink: {
    color: theme.colors.mint,
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(20),
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  selectedToggle: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    width: wp(85),
  },
  formInputContainer: {
    marginBottom: 10,
  },
  formInputLabel: {
    fontSize: scaleFontSize(14),
    color: theme.colors.gray,
    fontFamily: "Poppins-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  formInput: {
    backgroundColor: theme.colors.grayBackground,
    fontFamily: "Poppins-Regular",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextButtonContainer: {
    marginTop: 20,
  },
  nextButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: "white",
    fontFamily: "Poppins-Bold",
  },
});
