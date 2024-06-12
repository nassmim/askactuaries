"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";

import { DARK_MODE, LIGHT_MODE } from "@/constants";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("");

  const setTheme = (mode: string) => {
    setMode(mode);
    document.documentElement.classList.add(mode);
  };

  const handleThemeChange = useCallback(() => {
    mode === DARK_MODE ? setTheme(LIGHT_MODE) : setTheme(DARK_MODE);
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
