import React from "react";
import { useAuth } from "../../providers/AuthProvider";
import { Redirect, Slot } from "expo-router";

const GuardianRootLayout = () => {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={"/signup"} />;
  }
  return <Slot />;
};

export default GuardianRootLayout;
