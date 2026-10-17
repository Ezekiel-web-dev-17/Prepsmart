"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar automatically when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Public Links (Shown when unauthenticated)
  const publicLinks = [
    {
      href: "/",
      label: "Home",
      description: "JAMB prep platform overview",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      href: "/universities",
      label: "Universities",
      description: "Cut-offs & screening counsellor",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      href: "/careers",
      label: "Career Paths",
      description: "Match courses with high-demand careers",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  // Authenticated Links (Shown when signed in)
  const authenticatedLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      description: "Candidate command center",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-5a1 1 0 011-1h4a1 1 0 011 1v9a1 1 0 01-1 1h-4a1 1 0 01-1-1v-9z"
          />
        </svg>
      ),
    },
    {
      href: "/mock-exam",
      label: "Mock Exam",
      description: "JAMB CBT simulation & timer",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      href: "/study",
      label: "Syllabus",
      description: "Syllabus, modules & topics",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      href: "/leaderboard",
      label: "Leaderboard",
      description: "Real-time ranking & gamification",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
    },
    {
      href: "/universities",
      label: "Universities",
      description: "Cut-offs & screening counsellor",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      href: "/revision",
      label: "Revision Hub",
      description: "Examiner traps & flashcards",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
    },
    {
      href: "/progress",
      label: "Readiness",
      description: "UTME index & subject mastery",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3v18h18M7 16l4-4 4 4 5-6"
          />
        </svg>
      ),
    },
  ];

  const userIsSignedIn = mounted && isLoaded && !!isSignedIn;
  const currentNavLinks = userIsSignedIn ? authenticatedLinks : publicLinks;

  return (
    <>
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            scroll={true}
            href={userIsSignedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-extrabold shadow-sm shadow-blue-500/30 text-sm">
              PS
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                  PREPSMART
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium -mt-0.5 hidden sm:block">
                Understand. Practise. Revise.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  scroll={true}
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher on tablet/desktop */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Unauthenticated: Show Login / Sign Up buttons */}
            {mounted && isLoaded && !isSignedIn && (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  scroll={true}
                  href="/sign-in"
                  className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-bold transition-all cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  scroll={true}
                  href="/sign-up"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Authenticated: Show Quick Link and Profile Avatar */}
            {mounted && isLoaded && isSignedIn && (
              <div className="flex items-center gap-2">
                <Link
                  scroll={false}
                  href="/onboarding"
                  className="hidden sm:flex px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground items-center gap-1.5 transition-colors"
                >
                  <span>Onboarding Profile</span>
                </Link>

                <div className="ml-1 flex items-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 rounded-xl",
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open mobile navigation"
              aria-expanded={isOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer ml-0.5"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Navigator Side Bar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] z-50 bg-card border-r border-border shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile Navigation"
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          <Link
            scroll={true}
            href={userIsSignedIn ? "/dashboard" : "/"}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-extrabold shadow-sm text-xs">
              PS
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                PREPSMART
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wide">
                JAMB
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation sidebar"
            className="w-9 h-9 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {userIsSignedIn ? "Student Navigation" : "Explore PrepSmart"}
            </div>
            <nav className="space-y-1">
              {currentNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    scroll={true}
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900/50 shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-muted-foreground"
                      }
                    >
                      {link.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="leading-tight">{link.label}</div>
                      <div className="text-[11px] font-normal text-muted-foreground truncate">
                        {link.description}
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-border bg-muted/30 space-y-3">
          {/* Sign In & Sign Up if unauthenticated */}
          {mounted && isLoaded && !isSignedIn && (
            <div className="grid grid-cols-2 gap-2">
              <Link
                scroll={false}
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs flex items-center justify-center transition-all"
              >
                Sign In
              </Link>
              <Link
                scroll={false}
                href="/sign-up"
                onClick={() => setIsOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* User Status if authenticated */}
          {mounted && isLoaded && isSignedIn && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-2.5">
                <UserButton />
                <div className="text-xs font-semibold text-foreground">
                  Candidate Session
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Online
              </span>
            </div>
          )}

          {/* Theme Switcher inside Mobile Drawer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground font-medium">
              Theme Mode
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
