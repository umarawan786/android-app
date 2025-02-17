import React from "react";
import { Redirect, Slot } from "expo-router";

import { useAuth } from "@/providers/AuthProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const ChildRootLayout = () => {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href={"/signup"} />;
  }

  return (
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
  );
};

export default ChildRootLayout;
