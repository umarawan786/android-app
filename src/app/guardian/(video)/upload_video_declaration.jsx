import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import { wp, scaleFontSize } from "../../../helpers/common";
import { theme } from "../../../constants/theme";
import Icon from "../../../icons";
import { useRouter } from "expo-router";

const UploadVideoDeclaration = () => {
  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <View style={styles.videoUploadContainer}>
          <View>
            <Text style={styles.titleStyles}>Why it matters</Text>
            <Text style={styles.descriptionStyles}>
              This feature helps us to keep Liaura safe and keep the wrong kinds
              of people out. We match the video to the ID documents you provide.
            </Text>
          </View>

          <View>
            <Text style={styles.titleStyles}>What to do</Text>
            <Text style={styles.descriptionStyles}>
              Please film a short selfie video holding your ID and saying:
            </Text>
            <Text style={styles.descriptionStyles}>
              "I am "YOUR NAME" and I am creating accounts for "CHILD NAMES" on
              Liaura on "SAY TODAY'S DATE".
            </Text>
            <Text style={styles.descriptionStyles}>
              Make sure your surroundings are well lit and there's not a lot of
              background noise.
            </Text>
          </View>

          <View>
            <Text style={styles.titleStyles}>Upload video declaration</Text>
            <UploadVideoBox />
          </View>
        </View>
      </View>
    </GradientScreenWrapper>
  );
};

export default UploadVideoDeclaration;

const UploadVideoBox = () => {
  const router = useRouter();
  const handleUploadPress = () => {
    router.push("video_recorder");
  };
  return (
    <Pressable
      style={uploadVideoBoxStyles.uploadContainer}
      onPress={handleUploadPress}
    >
      <Icon name="upload" size={54} color={theme.colors.mint} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoUploadContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
    width: wp(85),
  },
  titleStyles: {
    fontFamily: "Poppins-SemiBold",
    fontSize: scaleFontSize(20),
    color: theme.colors.mint,
    textTransform: "uppercase",
  },
  descriptionStyles: {
    fontFamily: "Poppins-Regular",
    fontSize: scaleFontSize(16),
    color: theme.colors.gray,
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

const uploadVideoBoxStyles = StyleSheet.create({
  uploadContainer: {
    backgroundColor: theme.colors.grayBackground,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
