"use client";

import { useState, useEffect } from "react";
import { CheckCircleIcon, SparklesIcon, XIcon, ArrowRightIcon } from "@/components/ui/icons";

const STORAGE_KEY = "prepsmart_workspace_welcome_seen";

export default function FirstLoginWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        setIsOpen(true);
      }
    } catch {
      // Ignore localStorage exceptions in private browsing or SSR
    }
  }, []);

  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore
    }
    setIsOpen(false);
  };

  if (!mounted || !isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="workspace-welcome-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-2xl space-y-6 text-foreground animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close welcome message"
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
        >
          <XIcon className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Candidate Workspace
            </span>
            <h2
              id="workspace-welcome-title"
              className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug"
            >
              Welcome to Your Study Hub
            </h2>
          </div>
        </div>

        {/* Explanation Body */}
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            You are now in your private study workspace. To help you stay focused on your
            2 to 3 months of preparation without distractions, your top navigation bar shows
            only your active study tools:
          </p>

          <ul className="space-y-2 py-1">
            <li className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
              <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Workspace Navigation:</strong> Dashboard, Syllabus & CBT Exam, University Cut-Offs, Leaderboard, Community, and Feedback.
              </span>
            </li>
            <li className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
              <CheckCircleIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                <strong>Viewing Public Pages:</strong> To view the public Home page, Career Guide, or About Us, you can log out from your profile picture in the top-right corner anytime.
              </span>
            </li>
          </ul>

          <p className="text-xs text-muted-foreground/90 bg-muted/40 p-3 rounded-xl border border-border/60">
            This workspace layout keeps your daily targets, mock tests, and revision in front of you so you can practice consistently every single day.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <span>Got It, Enter Workspace</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
