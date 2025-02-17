import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { VideoView, useVideoPlayer } from "expo-video";

import { hp, scaleFontSize, wp } from "../../../helpers/common";
import GradientScreenWrapper from "../../../components/GradientScreenWrapper";
import { useAuth } from "../../../providers/AuthProvider";
import { supabase } from "../../../lib/supabase";
import LoadingModal from "../../../components/LoadingModal";
import {
  getFileExtension,
  readFileAsBase64ArrayBuffer,
} from "../../../helpers/file";
import { uploadVideDeclaration } from "../../../api/storage/declarations";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

const VideoPlayback = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("loading...");
  const [videoUri, setVideoUri] = useState(null);

  const { profile, refreshProfile } = useAuth();

  const router = useRouter();
  const localParams = useLocalSearchParams();

  const videoPlayer = useVideoPlayer(videoUri, (player) => {
    player.play();
  });

  useEffect(() => {
    const fetchVideoUri = async () => {
      const uri = await AsyncStorage.getItem(localParams.video);
      if (uri) {
        setVideoUri(uri);
      }

      // Clear asyncstorage
      await AsyncStorage.removeItem(localParams.video);
    };
    fetchVideoUri();
  }, []);

  const handleUploadPress = async () => {
    setLoading(true);
    setLoadingMessage("Processing...");

    try {
      const videoData = await readFileAsBase64ArrayBuffer(videoUri);

      setLoadingMessage("Uploading...");

      const videoExtension = getFileExtension(videoUri);

      // Upload videoData to supabase storage bucket
      const data = await uploadVideDeclaration(
        videoData,
        profile.id,
        videoExtension
      );

      if (data) {
        setLoadingMessage("almost done...");
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .update({ video_uploaded: true })
          .eq("id", profile.id);

        await refreshProfile(); // Refresh profile
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Error uploading video. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakePress = () => {
    router.replace("video_recorder");
  };

  return (
    <GradientScreenWrapper>
      <View style={styles.container}>
        <VideoView style={styles.video} player={videoPlayer} />

        {/* Upload Button */}
        <View style={styles.nextButtonContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleUploadPress}
          >
            <Text style={styles.nextButtonText}>Upload</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleRetakePress}
          >
            <Text style={styles.nextButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading modal */}
      <LoadingModal modalVisible={loading} task={loadingMessage} />
    </GradientScreenWrapper>
  );
};

export default VideoPlayback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    position: "absolute",
    top: hp(10),
    width: wp(90),
    height: hp(80),
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: hp(2),
    width: wp(80),
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
    fontSize: scaleFontSize(20),
  },
});
