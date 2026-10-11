"use client";

import { useState, useEffect } from "react";

export const MOTIVATION_MESSAGES = [
  "Way to go! 🚀",
  "I knew you could do it! 🌟",
  "Keep practicing, mastery is loading! 🧠",
  "You're on fire! 🔥",
  "Genius at work! ✨",
  "One step closer to your target score! 🎯",
  "Consistency beats talent every single day! 💪",
  "Unstoppable momentum! ⚡",
  "Future university scholar in the making! 🎓",
  "Examiner traps don't stand a chance against you! 🛡️",
  "Crushing milestones like a pro! 🏆",
  "Sharp focus, real progress! 📈",
];

export function getRandomMotivation(): string {
  const index = Math.floor(Math.random() * MOTIVATION_MESSAGES.length);
  return MOTIVATION_MESSAGES[index];
}

interface MotivationToastProps {
  message?: string;
  points?: number;
  onClose?: () => void;
  durationMs?: number;
}

export default function MotivationToast({
  message,
  points = 5,
  onClose,
  durationMs = 4000,
}: MotivationToastProps) {
  const [visible, setVisible] = useState(true);
  const activeMessage = message || getRandomMotivation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-6 z-50 pointer-events-auto transition-all animate-bounce-short">
      <div className="rounded-2xl bg-card/95 backdrop-blur-md border border-amber-500/40 p-4 shadow-xl shadow-amber-500/10 flex items-center gap-3.5 max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 via-amber-500 to-yellow-500 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
          🎉
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Micro-Motivation
          </div>
          <p className="font-extrabold text-sm text-foreground leading-tight mt-0.5">
            {activeMessage}
          </p>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 inline-block mt-0.5">
            +{points} XP Earned
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="text-muted-foreground hover:text-foreground text-xs p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
