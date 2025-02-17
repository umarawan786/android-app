import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../providers/AuthProvider";
import {
  validateDOB,
  validateEmail,
  validatePassword,
} from "../../helpers/validators";
import { theme } from "../../constants/theme";
import { scaleFontSize, wp } from "../../helpers/common";

export default function SignUpForm() {
  // TODO: Remove defaults later
  const nameRef = useRef("Jiara Martins");
  const emailRef = useRef("jiara@gmail.com");
  const passwordRef = useRef("12345678");
  const confirmPasswordRef = useRef("12345678");
  const dateOfBirthRef = useRef("1980-01-01");
  const numberOfChildAccountsRef = useRef("3");
  const [loading, setLoading] = useState(false);

  const { guardianSignUp } = useAuth();

  const validateInputs = () => {
    if (nameRef.current === "") {
      Alert.alert("Please enter your name");
      return false;
    }

    const emailValidationResult = validateEmail(emailRef.current);

    if (!emailValidationResult.isValid) {
      Alert.alert(emailValidationResult.message);
      return false;
    }

    const passwordValidationResult = validatePassword(
      passwordRef.current,
      nameRef.current,
      emailRef.current
    );

    if (!passwordValidationResult.isValid) {
      Alert.alert(passwordValidationResult.message);
      return false;
    }

    if (passwordRef.current !== confirmPasswordRef.current) {
      Alert.alert("Passwords do not match");
      return false;
    }

    const dateValidationResult = validateDOB(dateOfBirthRef.current);

    if (!dateValidationResult.isValid) {
      Alert.alert(dateValidationResult.message);
      return false;
    }

    if (numberOfChildAccountsRef.current === "") {
      Alert.alert("Please enter the number of child accounts");
      return false;
    }

    return true;
  };

  const handlePress = async () => {
    setLoading(true);
    if (validateInputs()) {
      await guardianSignUp(
        nameRef.current,
        emailRef.current,
        passwordRef.current,
        dateOfBirthRef.current,
        numberOfChildAccountsRef.current
      );
    }
    setLoading(false);
  };
  return (
    <View style={styles.formContainer}>
      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your name"
          defaultValue={nameRef.current}
          onChangeText={(text) => (nameRef.current = text)}
        />
      </View>

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

      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Confirm Password</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your password again"
          // secureTextEntry
          defaultValue={confirmPasswordRef.current}
          onChangeText={(text) => (confirmPasswordRef.current = text)}
        />
      </View>

      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Date of Birth</Text>
        <TextInput
          style={styles.formInput}
          placeholder="YYYY-MM-DD"
          defaultValue={dateOfBirthRef.current}
          onChangeText={(text) => (dateOfBirthRef.current = text)}
        />
      </View>

      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Number of Child Accounts</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter number of child accounts"
          defaultValue={numberOfChildAccountsRef.current}
          onChangeText={(text) => (numberOfChildAccountsRef.current = text)}
        />
      </View>

      {/* Ask to sign terms and conditions */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By signing up, you agree to our{" "}
          <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
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
              <ActivityIndicator color={"white"} />
            ) : (
              <Text style={styles.nextButtonText}>Next</Text>
            )}
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  termsContainer: {
    marginTop: 20,
  },
  termsText: {
    fontSize: scaleFontSize(14),
    color: "black",
    fontFamily: "Poppins-Regular",
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
