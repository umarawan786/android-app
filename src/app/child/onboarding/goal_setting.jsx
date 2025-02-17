import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground as IB,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React from "react";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuth } from "@/providers/AuthProvider";
import Avatar from "@/components/Avatar";
import { hp, scaleFontSize, wp } from "@/helpers/common";
import Dots from "@/components/Dots";
import { FlashList } from "@shopify/flash-list";
import { ImageBackground } from "expo-image";
import Icon from "@/icons";

import * as ImagePicker from "expo-image-picker";
import { getFileExtension, readFileAsBase64ArrayBuffer } from "@/helpers/file";
import {
  uploadGoalImage,
  useGoalImage,
  useInsertNewGoal,
  useMyGoals,
} from "@/api/storage/goals";
import { useGoals } from "@/api/goals";
import { supabase } from "@/lib/supabase";

const GoalSetting = () => {
  const { theme } = useTheme();
  const { profile, refreshProfile } = useAuth();

  const handleNext = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ onboarding_complete: true })
      .eq("id", profile.id);

    if (error) {
      Alert.alert(
        "Error",
        "Failed to update profile. Please check your connection"
      );
      return;
    }
    await refreshProfile();
  };

  if (!profile) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          {/* Name Title */}
          <Text style={[styles.text, styles.name, { color: theme.foreground }]}>
            {profile.first_name}
          </Text>

          {/* Avatar Container */}
          <View
            style={[styles.avatarContainer, { borderColor: theme.foreground }]}
          >
            <Avatar
              location={profile?.avatar_file_location}
              imageStyles={{ borderRadius: wp(15) }}
            />
          </View>

          {/* Dots */}
          <Dots
            number={3}
            highlighted={3}
            color={theme.foreground}
            width={wp(4)}
          />

          <View style={styles.headingContainer}>
            {/* Heading */}
            <Text style={[styles.heading, { color: theme.foreground }]}>
              Set Goals
            </Text>

            {/* P */}
            <Text style={[styles.text]}>
              Choose your goals for the weeks, months or even years ahead.
            </Text>
          </View>

          <RenderGoals profile={profile} />

          {/* Finish */}
          <Pressable
            style={[
              styles.finishButtonContainer,
              { backgroundColor: theme.foreground },
            ]}
            onPress={handleNext}
          >
            <Text
              style={[styles.finishButtonText, { color: theme.background }]}
            >
              Finish
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default GoalSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    gap: 20,
    paddingBottom: 100,
  },
  text: {
    color: "white",
    fontFamily: "Poppins-Light",
    fontSize: scaleFontSize(16),
    textAlign: "center",
  },
  name: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
    paddingTop: hp(10),
    lineHeight: 1,
  },
  avatarContainer: {
    width: wp(30),
    aspectRatio: 1,
    borderRadius: wp(20),
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(28),
  },
  headingContainer: {
    alignItems: "center",
    width: wp(80),
  },
  finishButtonContainer: {
    paddingVertical: 5,
    paddingHorizontal: 40,
    width: wp(70),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  finishButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(40),
  },
});

const RenderGoals = ({ profile }) => {
  const { theme } = useTheme();
  const [showState, setShowState] = React.useState("goals"); // goals || add-goals

  const { data, isPending, error } = useGoals(profile.id);

  if (isPending) {
    return <ActivityIndicator size={"large"} color={theme.foreground} />;
  }

  if (error) {
    return (
      <Text style={{ color: theme.foreground }}>
        Error loading goals. Please check your connection
      </Text>
    );
  }

  return (
    <View style={renderGoalsStyles.container}>
      <Text style={[renderGoalsStyles.heading, { color: theme.foreground }]}>
        My goals
      </Text>

      {showState === "goals" && (
        <FlashList
          horizontal
          data={data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({ item }) => <GoalCard item={item} />}
          estimatedItemSize={167}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={{ color: theme.foreground }}>No goals yet</Text>
          )}
        />
      )}

      {showState === "goals" && (
        <Pressable
          style={{
            alignItems: "flex-end",
            marginTop: 20,
          }}
          onPress={() => {
            showState === "goals"
              ? setShowState("add-goals")
              : setShowState("goals");
          }}
        >
          <Icon name={"plus"} fill={theme.foreground} size={44} />
        </Pressable>
      )}

      {showState === "add-goals" && <AddNewGoal setShowState={setShowState} />}
    </View>
  );
};

const goals = [
  // { id: 1, goal: "Become a Football Captain" },
  // { id: 2, goal: "Something else" },
];

const renderGoalsStyles = StyleSheet.create({
  container: {
    width: wp(80),
    marginVertical: 20,
  },
  heading: {
    fontFamily: "Poppins-Bold",
    fontSize: scaleFontSize(20),
  },
});

const placeholder =
  "https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

const GoalCard = ({ item }) => {
  const { goal, imageUrl } = item || {};

  const { data, isPending, error } = useGoalImage(imageUrl);

  return (
    <ImageBackground
      source={isPending ? placeholder : data.publicUrl}
      style={{
        backgroundColor: "black",
        width: 180,
        height: 150,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        marginRight: 10,
      }}
      contentFit="cover"
      imageStyle={{
        borderRadius: 25,
        opacity: 0.8,
      }}
    >
      <Text
        style={{
          color: "white",
          fontFamily: "Poppins-ExtraBold",
          fontSize: scaleFontSize(16),
        }}
      >
        {goal || "No name"}
      </Text>
    </ImageBackground>
  );
};

const AddNewGoal = ({ setShowState }) => {
  const { theme } = useTheme();
  const { profile } = useAuth();

  const goal = React.useRef("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(null);

  const {
    mutate: goalInsertMutation,
    error: mutationError,
    isPending: mutationPending,
  } = useInsertNewGoal();

  const handleAddGoal = async () => {
    const imageArrayBuffer = await readFileAsBase64ArrayBuffer(imageUrl);
    const imageArrayExt = getFileExtension(imageUrl);

    const filename = `${
      profile.id
    }_${Math.random().toString()}_${imageArrayExt}`;

    try {
      const { fullPath } = await uploadGoalImage(imageArrayBuffer, filename);
      goalInsertMutation({
        goalName: goal.current,
        filePath: fullPath.split("/")[1],
      });
      setShowState("goals");
    } catch (error) {
      console.error("Error uploading goal image:", error);
      Alert.alert("Error", "Please try again");
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.foreground,
        height: 200,
        borderRadius: 20,
        paddingTop: 10,
        alignItems: "center",
      }}
    >
      <Text
        style={[
          {
            fontSize: scaleFontSize(18),
            fontFamily: "Poppins-Bold",
            color: theme.background,
          },
        ]}
      >
        Name a Goal
      </Text>
      <TextInput
        style={{
          color: theme.background,
          textAlign: "center",
        }}
        defaultValue=""
        onChangeText={(text) => (goal.current = text)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="max 20 characters"
      />

      {/* Upload Photo / Selected photo */}
      {imageUrl ? (
        <View
          style={{
            width: "80%",
            height: "50%",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name={"checkCircle"} fill={theme.background} size={64} />
        </View>
      ) : (
        <UploadPhoto
          iconColor={theme.background}
          iconSize={64}
          setImageUrl={setImageUrl}
        />
      )}

      {/* Add / Cancel buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          borderColor: "red",
        }}
      >
        <Pressable onPress={() => setShowState("goals")}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontWeight: scaleFontSize(20),
              color: theme.background,
            }}
          >
            Cancel
          </Text>
        </Pressable>
        <Pressable onPress={handleAddGoal}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontWeight: scaleFontSize(20),
              color: theme.background,
            }}
          >
            Add
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

// Might need it again somewhere else
export const UploadPhoto = ({
  iconColor = "black",
  iconSize = 32,
  setImageUrl,
}) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const handlePress = async () => {
    await pickImage();
  };

  return (
    <View
      style={{
        width: "80%",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <Pressable onPress={handlePress}>
        <Icon name={"upload"} fill={iconColor} size={iconSize} />
      </Pressable>
    </View>
  );
};
