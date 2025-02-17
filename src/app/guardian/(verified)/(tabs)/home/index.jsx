import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import GradientScreenWrapper from "@/components/GradientScreenWrapper";
import HeaderBar from "@/components/HeaderBar";
import LogOutButton from "@/components/LogOutButton";
import FamilyTitle from "@/components/FamilyTitle";
import EditFamilyName from "@/components/EditFamilyName";
import VerticalPadding from "@/components/VerticalPadding";
import { useFamilyTitle, useUpdateFamilyTitle } from "@/api/profile";
import { theme } from "@/constants/theme";
import { wp } from "@/helpers/common";
import RenderAllChilds from "@/components/RenderAllChilds";
import { useRouter } from "expo-router";

const GuardianHomeScreen = ({ navigation }) => {
  const [snapIndex, setSnapIndex] = useState(-1);
  const bottomSheetRef = useRef(null);
  const newFamilyName = useRef("");
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const router = useRouter();

  const { isPending, isError, error, data } = useFamilyTitle();
  const {
    isPending: pendingFamilyTitleUpdate,
    isError: familyTitleUpdateIsError,
    error: familyTitleUpdateError,
    mutate,
  } = useUpdateFamilyTitle();

  if (isError) {
    console.error(error);
  }
  if (familyTitleUpdateIsError) {
    console.error(familyTitleUpdateError.message);
  }

  const updateFamilyName = () => {
    mutate({ new_family_name: newFamilyName.current });
    setSnapIndex(-1);
    bottomSheetRef.current?.close();
  };

  const notifPress = () => {
    router.push("/guardian/notifications");
  };

  return (
    <GradientScreenWrapper>
      {/* Header */}
      <HeaderBar
        rightIconOnPress={() => {
          notifPress();
        }}
      />

      <VerticalPadding padding={20} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Title bar */}
        <View style={styles.title}>
          {/* Family Title */}
          {pendingFamilyTitleUpdate || isPending ? (
            <ActivityIndicator size="large" color={theme.colors.white} />
          ) : (
            <FamilyTitle familyName={data.family_name} />
          )}

          {/* Edit Family Name */}
          <EditFamilyName
            bottomSheetRef={bottomSheetRef}
            snapIndex={snapIndex}
            setSnapIndex={setSnapIndex}
          />
        </View>

        {/* Family Cards */}
        <RenderAllChilds />

        {/* Log out button */}
        <LogOutButton style={{ marginTop: 50, width: "40%" }} />

        <Pressable
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: theme.colors.blush,
            borderRadius: 10,
            marginTop: 20,
            width: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.push("TestScreen")}
        >
          <Text style={{ color: "black", fontFamily: "Poppins-Bold" }}>
            Playground
          </Text>
        </Pressable>
      </ScrollView>

      <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} index={-1}>
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.label}>Family Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder={data?.family_name || "Not Set"}
            defaultValue={newFamilyName.current}
            onChangeText={(text) => (newFamilyName.current = text)}
          />
          <Pressable
            style={styles.updateButton}
            onPress={() => updateFamilyName()}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </BottomSheetView>
      </BottomSheet>
    </GradientScreenWrapper>
  );
};

export default GuardianHomeScreen;

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  textInput: {
    margin: 20,
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  updateButton: {
    backgroundColor: theme.colors.mint,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: wp(50),
  },
  updateButtonText: {
    color: theme.colors.white,
    fontFamily: "Poppins-Bold",
  },
});
