import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import { theme } from "../constants/theme";
import { useAuth } from "../providers/AuthProvider";
import LoadingModal from "../components/LoadingModal";

const LogOutButton = ({ buttonContainerStyles, titleStyles, ...props }) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <>
      <CustomButton
        containerStyles={buttonContainerStyles || styles.buttonContainerStyles}
        title={"Logout"}
        titleStyles={titleStyles || styles.titleStyles}
        onPress={handleLogout}
        {...props}
      />
      {/* Loading Modal */}
      <LoadingModal modalVisible={loading} task={"Signing out"} />
    </>
  );
};

export default LogOutButton;

const styles = StyleSheet.create({
  buttonContainerStyles: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.mint,
  },
  titleStyles: {
    color: theme.colors.white,
    fontFamily: "Poppins-Bold",
  },
});
