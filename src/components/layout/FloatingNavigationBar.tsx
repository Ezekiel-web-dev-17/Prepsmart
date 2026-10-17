"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: (props: { className?: string }) => React.JSX.Element;
  badge?: string | number;
}

export interface FloatingNavigationBarProps {
  activeId?: string;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  userStreakCount?: number;
}

export function FloatingNavigationBar({
  activeId = "courses",
  isFocusMode = false,
  onToggleFocusMode,
  userStreakCount = 14,
}: FloatingNavigationBarProps) {
  const [currentTab, setCurrentTab] = useState(activeId);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect width="7" height="9" x="3" y="3" rx="2" />
          <rect width="7" height="5" x="14" y="3" rx="2" />
          <rect width="7" height="9" x="14" y="12" rx="2" />
          <rect width="7" height="5" x="3" y="16" rx="2" />
        </svg>
      ),
    },
    {
      id: "courses",
      label: "Courses",
      href: "/study",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      ),
    },
    {
      id: "revision",
      label: "Revision",
      href: "/revision",
      badge: "3 Due",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
      ),
    },
    {
      id: "mock-exam",
      label: "Mock Exam",
      href: "/mock-exam",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: "progress",
      label: "Analytics",
      href: "/progress",
      icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
    },
  ];

  return (
    <header
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out max-w-fit w-[calc(100%-2rem)] ${
        isFocusMode
          ? "opacity-20 hover:opacity-100 hover:translate-y-0 translate-y-[-6px]"
          : "opacity-100 translate-y-0"
      }`}
      aria-label="Primary Navigation"
    >
      <nav
        className="
          flex items-center justify-between sm:justify-start gap-1 sm:gap-1.5 px-3 py-2
          rounded-full
          bg-white/70 dark:bg-[#1C1C1E]/75
          backdrop-blur-2xl backdrop-saturate-[180%]
          border border-white/50 dark:border-white/10
          shadow-liquid-dock dark:shadow-liquid-dark-dock
          transition-all duration-300
        "
      >
        {/* Apple Brand / Platform Sigil */}
        <Link
          href="/"
          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] hover:scale-105 active:scale-95 transition-transform shrink-0 mr-1"
          aria-label="PrepSmart Home"
        >
          <span className="font-bold text-xs tracking-tighter">PS</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setCurrentTab(item.id)}
                className={`
                  relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-semibold
                  transition-all duration-200 select-none outline-none whitespace-nowrap
                  focus-visible:ring-2 focus-visible:ring-blue-500/50
                  ${
                    isActive
                      ? "text-[#1D1D1F] dark:text-[#FFFFFF] bg-white/90 dark:bg-white/15 shadow-sm border border-white/60 dark:border-white/15"
                      : "text-[#6E6E73] dark:text-[#A1A1A6] hover:text-[#1D1D1F] dark:hover:text-[#FFFFFF] hover:bg-black/5 dark:hover:bg-white/5"
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isActive ? "scale-110" : ""}`} />
                <span className="hidden sm:inline">{item.label}</span>

                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Vertical Separator */}
        <div className="h-4 w-[1px] bg-black/10 dark:bg-white/10 mx-1 shrink-0 hidden sm:block" aria-hidden="true" />

        {/* Study Streak Capsule */}
        <div
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-medium shrink-0"
          title={`${userStreakCount} Day Active Study Streak`}
        >
          <span className="animate-pulse">🔥</span>
          <span className="font-semibold">{userStreakCount}d</span>
        </div>

        {/* Focus Mode Toggle */}
        {onToggleFocusMode && (
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`
              flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full
              transition-all duration-200 text-xs shrink-0
              ${
                isFocusMode
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/50"
                  : "bg-black/5 dark:bg-white/5 text-[#6E6E73] dark:text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white"
              }
            `}
            title={isFocusMode ? "Exit Focus Mode" : "Enter Zero-Distraction Focus Mode"}
            aria-label="Toggle Focus Mode"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M3 12h2" />
              <path d="M19 12h2" />
              <path d="M12 3v2" />
              <path d="M12 19v2" />
            </svg>
          </button>
        )}
      </nav>
    </header>
  );
}
export default FloatingNavigationBar;
