"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) return storedTheme;

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }
  return "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">(getInitialTheme);

  const applyTheme = (theme: "light" | "dark") => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  };

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
