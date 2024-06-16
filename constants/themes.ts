const LOCALSTORAGE_THEME_NAME = "theme";

const LIGHT_MODE = "light";
const DARK_MODE = "dark";
const SYSTEM_MODE = "system";

type ThemeName = typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;

interface ITheme {
  value: ThemeName;
  label: Capitalize<ThemeName>;
  icon: string;
}

const themes: Record<ThemeName, ITheme> = {
  light: { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  dark: { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  system: {
    value: "system",
    label: "System",
    icon: "/assets/icons/computer.svg",
  },
};

export { LOCALSTORAGE_THEME_NAME, LIGHT_MODE, DARK_MODE, SYSTEM_MODE, themes };
export type { ThemeName, ITheme };
