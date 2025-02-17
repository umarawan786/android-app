import {
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { scaleFontSize, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../lib/supabase";
import LoadingModal from "../LoadingModal";
import Icon from "../../icons";
import { validateDOB, validatePassword } from "../../helpers/validators";
import { constructChildEmail } from "../../helpers/constructChildEmail";
import { createChildAccount } from "../../api/account/index";
import {
  updateNumberOfChildAccountsCreated,
  updateOnboardingStatus,
} from "../../api/profile/index";
import {
  getFileExtension,
  readFileAsBase64ArrayBuffer,
} from "../../helpers/file";
import { uploadEvidence } from "../../api/storage/evidence";
import { uploadAvatar } from "../../api/storage/avatars";
import { useRouter } from "expo-router";

const ChildSignUpForm = () => {
  const nameRef = useRef("Martins");
  const passwordRef = useRef("12345678");
  const confirmPasswordRef = useRef("12345678");
  const dateOfBirthRef = useRef("2018-01-01");
  const [current, setCurrent] = useState(1);
  const [evidence, setEvidence] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { profile, refreshProfile } = useAuth();

  useEffect(() => {
    setCurrent(profile?.number_of_child_accounts_created || 1);
  }, [profile]);

  const validateInputs = () => {
    if (nameRef.current === "") {
      Alert.alert("Please enter child's first name");
      return false;
    }

    const passwordValidationResult = validatePassword(
      passwordRef.current,
      nameRef.current,
      profile.full_name // Ensure the password does not contain the guardian's name
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

    if (!evidence) {
      Alert.alert("Please upload evidence (child id)");
      return false;
    }

    if (!avatar) {
      Alert.alert("Please upload a profile picture");
      return false;
    }

    return true;
  };

  const signUpChild = async () => {
    if (!validateInputs()) {
      return -1;
    }

    const childEmail = constructChildEmail(profile.email, nameRef.current);

    const metadata = {
      guardian_id: profile.id,
      first_name: nameRef.current,
      date_of_birth: dateOfBirthRef.current,
      role: "child",
      email: childEmail,
      onboarding_complete: false,
    };

    const response = await createChildAccount(
      childEmail,
      passwordRef.current,
      metadata
    );

    if (!response.ok) {
      const error = await response.json();
      Alert.alert(
        "Error creating child account",
        error.message || "Please try again"
      );
      return -1;
    } else {
      const data = await response.json();
      return data;
    }
  };

  const handlePress = async () => {
    setLoading(true);

    // Create child account and move to next
    const success = await signUpChild();
    if (success === -1) {
      setLoading(false);
      return;
    }

    // Successfully created child account, upload evidence and update child details
    const evidenceArrayBuffer = await readFileAsBase64ArrayBuffer(evidence);
    const evidenceExtension = getFileExtension(evidence);

    await uploadEvidence(
      evidenceArrayBuffer,
      profile.id,
      success.user.id,
      evidenceExtension
    );

    // Upload avatar
    let avatarSuccessfull = false;
    const avatarArrayBuffer = await readFileAsBase64ArrayBuffer(avatar);
    const avatarExtension = getFileExtension(avatar);
    const filename = `${success.user.id}/avatar.${avatarExtension}`;
    try {
      const data = await uploadAvatar(avatarArrayBuffer, filename);
      if (data) {
        avatarSuccessfull = true;
      }
    } catch (error) {
      console.error("Error uploading Avatar", error);
    }

    const updateObject = {
      avatar_file_location: avatarSuccessfull ? filename : null,
    };

    const { data, error } = await supabase
      .from("profiles")
      .update(updateObject)
      .eq("id", success.user.id);

    if (error) {
      console.error("Error updating child details: ", error.message);
    }
    if (data) {
      console.log("Data", data);
    }

    if (current < profile.initial_no_child) {
      await updateNumberOfChildAccountsCreated(profile.id, current + 1);
      await refreshProfile(); // Update profile to reflect the new number of child accounts created
    }
    if (current === profile.initial_no_child) {
      // Update onboarding status and move to verification screen
      try {
        await updateOnboardingStatus(profile.id);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);

      await refreshProfile();
      router.replace("/");
    }
    setLoading(false);
  };

  const handleSkip = async () => {
    try {
      await updateOnboardingStatus(profile.id);
    } catch (error) {
      console.error(error);
    }
    await refreshProfile();
    router.replace("/");
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.innerTitleContainer}>
        <Text style={styles.innerTitle}>
          Account {current} of {profile.initial_no_child}
        </Text>
      </View>
      <View style={styles.formInputContainer}>
        <Text style={styles.formInputLabel}>Child Name</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Enter your name"
          defaultValue={nameRef.current}
          onChangeText={(text) => (nameRef.current = text)}
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

      <View>
        <Text style={styles.formInputLabel}>Upload evidence (child id)</Text>
        <UploadMediaBox setImage={setEvidence} type="file" />
      </View>

      <View>
        <Text style={styles.formInputLabel}>Upload Profile picture</Text>
        <UploadMediaBox setImage={setAvatar} />
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
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </LinearGradient>
      </View>

      {/* Skip Button */}
      <View style={styles.nextButtonContainer}>
        <LinearGradient
          colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ borderRadius: 10 }}
        >
          <Pressable style={styles.nextButton} onPress={handleSkip}>
            <Text style={styles.nextButtonText}>{"Skip"}</Text>
          </Pressable>
        </LinearGradient>
      </View>

      {/* Loading Modal */}
      <LoadingModal
        modalVisible={loading}
        task={"Uploading files and creating account"}
      />
    </View>
  );
};

export default ChildSignUpForm;

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    width: wp(85),
  },
  innerTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  innerTitle: {
    color: theme.colors.mint,
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(25),
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

const UploadMediaBox = ({ setImage, type = "image" }) => {
  const pickDocument = async () => {
    try {
      const documentResult = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Accept all file types. Use specific types like 'application/pdf' for PDFs.
        multiple: false, // Set to true to allow multiple file selection (iOS/Android only)
      });

      if (!documentResult.canceled) {
        setImage(documentResult.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUploadPress = async () => {
    if (type === "image") {
      await pickImage();
    } else if (type === "file") {
      await pickDocument();
    }
  };
  return (
    <Pressable
      style={uploadMediaBoxStyles.uploadContainer}
      onPress={handleUploadPress}
    >
      <Icon name="upload" size={54} color={theme.colors.mint} />
    </Pressable>
  );
};

const uploadMediaBoxStyles = StyleSheet.create({
  uploadContainer: {
    backgroundColor: theme.colors.grayBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
