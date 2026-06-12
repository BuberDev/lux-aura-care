"use client";

import { useEffect, type ReactNode } from "react";

const THEME_STORAGE_KEY = "lux-aura-theme";
const THEME_CHANGE_EVENT = "lux-aura-theme-change";

export type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme, persist = false) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#090807" : "#f8f5ef");

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}

export function getActiveTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (!window.localStorage.getItem(THEME_STORAGE_KEY)) {
        applyTheme(getSystemTheme());
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      applyTheme(event.newValue === "light" || event.newValue === "dark" ? event.newValue : getSystemTheme());
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return children;
}

export { THEME_CHANGE_EVENT };
