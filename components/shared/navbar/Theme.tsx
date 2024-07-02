"use client";

import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";

import { useTheme } from "@context/ThemeProvider";
import { ThemeName, themes } from "@constants";

const themeKeys = Object.keys(themes) as (keyof typeof themes)[];

const Theme = () => {
  const { mode, setMode } = useTheme();

  const handleThemeChange = (name: ThemeName) => {
    setMode(name);
  };

  return (
    <Menubar className="relative border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger className="focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200">
          {mode === themes.light.value ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="sun"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="sun"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent className="absolute right-[-48px] mt-3 min-w-[120px] rounded border bg-light-900 py-2 dark:border-dark-400 dark:bg-dark-300">
          {themeKeys.map((name, index) => (
            <MenubarItem
              key={`${name}-${index}`}
              onClick={() => {
                handleThemeChange(name);
              }}
              className="flex cursor-pointer items-center gap-4 px-2.5 py-2 focus:bg-light-800 dark:focus:bg-dark-400"
            >
              <Image
                src={themes[name].icon}
                alt={themes[name].value}
                width={16}
                height={16}
                className={`${mode === themes[name].value && "active-theme"}`}
              ></Image>
              <p
                className={`body-semibold text-light-500 ${mode === themes[name].value ? "text-primary-500" : "text-dark100_light900"}`}
              >
                {themes[name].label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
