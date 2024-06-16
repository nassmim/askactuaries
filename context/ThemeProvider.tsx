"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

import { ThemeName, themes } from "@/constants";
import { LOCALSTORAGE_THEME_NAME, SYSTEM_MODE } from "@constants/themes";

interface ThemeContextType {
  mode: ThemeName;
  setMode: (mode: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const storedMode =
    (localStorage.getItem(LOCALSTORAGE_THEME_NAME) as ThemeName) || SYSTEM_MODE;
  const [mode, setMode] = useState<ThemeName>(storedMode);

  const handleThemeChange = useCallback(() => {
    const darkMode = themes.dark.value;

    if (
      mode === darkMode ||
      (mode === SYSTEM_MODE &&
        window.matchMedia("(prefers-color-scheme:dark)").matches)
    )
      document.documentElement.classList.add(darkMode);
    else document.documentElement.classList.remove(darkMode);

    if (mode !== SYSTEM_MODE)
      localStorage.setItem(LOCALSTORAGE_THEME_NAME, mode);
    else localStorage.removeItem(LOCALSTORAGE_THEME_NAME);
  }, [mode]);

  useEffect(() => {
    handleThemeChange();
  }, [handleThemeChange]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export default ThemeProvider;
