import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ThemeProviderContext } from "./theme-context";
import type { Theme } from "./theme-context";

type Props = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "pixel-weather-theme" }: Props) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === "light" || saved === "dark" || saved === "system" ? saved : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme);
  }, [theme]);

  const update = (next: Theme) => {
    try { localStorage.setItem(storageKey, next); } catch { /* Storage may be disabled. */ }
    setTheme(next);
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme: update }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
