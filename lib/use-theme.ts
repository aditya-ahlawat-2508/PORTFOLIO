"use client";

import { useCallback, useSyncExternalStore } from "react";
import { readThemeName, subscribeTheme } from "./subscribe-theme";

function getServerSnapshot(): "dark" {
  return "dark";
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, readThemeName, getServerSnapshot);

  const setTheme = useCallback((next: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }, []);

  return { theme, setTheme } as const;
}
