"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { Button } from "./ui/button";
import { useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ChangeTheme() {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  return (
    <Button
      onClick={() => {
        setCurrentTheme(currentTheme === "light" ? "dark" : "light");
        setTheme(currentTheme === "dark" ? "dark" : "light");
      }}
    >
      Change Theme
    </Button>
  );
}
