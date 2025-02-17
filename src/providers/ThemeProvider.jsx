import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = React.createContext({});

export const themeColorOptions = [
  {
    id: "azure_white",
    background: "#4490CD", // Azure
    foreground: "#FFFFFF", // White
  },
  {
    id: "mint_blush",
    background: "#67C3A5", // Mint
    foreground: "#FCE2E1", // Blush
  },
  {
    id: "azure_golden",
    background: "#4490CD", // Azure
    foreground: "#FFCA46", // Golden
  },
  {
    id: "golden_azure",
    background: "#FFCA46", // Golden
    foreground: "#4490CD", // Azure
  },
  {
    id: "coral_golden",
    background: "#EE4434", // Coral
    foreground: "#FFCA46", // Golden
  },
  {
    id: "blush_coral",
    background: "#FCE2E1", // Blush
    foreground: "#EE4434", // Coral
  },
  {
    id: "blush_mint",
    background: "#FCE2E1", // Blush
    foreground: "#67C3A5", // Mint
  },
  {
    id: "purple_white",
    background: "#7654A2", // Purple
    foreground: "#FFFFFF", // White
  },
];

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(themeColorOptions[0]);

  React.useEffect(() => {
    const loadTheme = async () => {
      const storedThemeId = await AsyncStorage.getItem("appTheme");
      if (storedThemeId) {
        const selectedTheme = themeColorOptions.find(
          (option) => option.id === storedThemeId
        );
        if (selectedTheme) {
          setTheme(selectedTheme);
        }
      }
    };

    loadTheme();
  }, []);

  const updateTheme = React.useCallback(async (themeId) => {
    const selectedTheme = themeColorOptions.find(
      (option) => option.id === themeId
    );
    if (selectedTheme) {
      setTheme(selectedTheme);
      await AsyncStorage.setItem("appTheme", themeId);
    }
  }, []);

  const value = React.useMemo(
    () => ({ theme, updateTheme }),
    [theme, updateTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "Wrap this component with ThemeProvider to use this context"
    );
  }

  return context;
};
