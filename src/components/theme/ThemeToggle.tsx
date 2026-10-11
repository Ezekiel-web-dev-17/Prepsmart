"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme, type Theme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: "light",
      label: "Light",
      icon: (
        <svg
          className="w-4 h-4 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      value: "dark",
      label: "Dark",
      icon: (
        <svg
          className="w-4 h-4 text-sky-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      value: "system",
      label: "System",
      icon: (
        <svg
          className="w-4 h-4 text-slate-500 dark:text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Primary Toggle Button */}
      <button
        type="button"
        onClick={() => toggleTheme()}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-label={`Current theme: ${theme}. Click to switch to ${isDark ? "light" : "dark"
          } mode, or open menu.`}
        title={`Theme: ${theme.toUpperCase()} (Click to toggle)`}
        className="group relative flex items-center justify-center w-8 h-8 rounded-xl border border-border bg-card hover:bg-muted text-foreground shadow-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
      >
        {isDark ? (
          <svg
            className="w-4 h-4 text-sky-400 transform transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-amber-500 transform transition-transform duration-300 group-hover:rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>

      {/* Quick Menu Launcher Icon button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select theme mode"
        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-muted border border-border flex items-center justify-center text-[8px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        ▼
      </button>

      {/* Dropdown Menu for Light / Dark / System */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-card border border-border shadow-xl shadow-black/10 dark:shadow-black/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Select Theme
          </div>
          {options.map((opt) => {
            const isSelected = (mounted ? theme : "system") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${isSelected
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
