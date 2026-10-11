"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "prepsmart-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Synchronously update <html> class, attribute, and colorScheme
  const updateDOM = useCallback((resolved: ResolvedTheme) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (resolved === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      root.style.colorScheme = "light";
    }
  }, []);

  // Initialize theme from localStorage on client mount
  useEffect(() => {
    let initialTheme: Theme = "system";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ["light", "dark", "system"].includes(stored)) {
        initialTheme = stored;
      }
    } catch {
      // fallback to system
    }

    setThemeState(initialTheme);
    const resolved = initialTheme === "system" ? getSystemTheme() : initialTheme;
    setResolvedTheme(resolved);
    updateDOM(resolved);
  }, [updateDOM]);

  // Listen to OS system theme changes when in 'system' mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const next = getSystemTheme();
        setResolvedTheme(next);
        updateDOM(next);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, updateDOM]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn("Unable to save theme preference:", e);
    }

    const nextResolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(nextResolved);
    updateDOM(nextResolved);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
