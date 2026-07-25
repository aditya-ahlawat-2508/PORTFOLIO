"use client";

import { useTheme } from "@/lib/use-theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle color theme"
      className="font-mono text-eyebrow uppercase tracking-wide text-muted hover:text-signal transition-colors px-2 py-1 border border-hairline rounded-[2px]"
    >
      {theme}
    </button>
  );
}
