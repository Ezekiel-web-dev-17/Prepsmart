"use client";

import { useEffect, useState, useCallback, createContext, useContext } from "react";
import type { XpEventType } from "@/lib/gamification";

export interface XPToastEvent {
  id: string;
  points: number;
  eventType: XpEventType;
  message?: string;
  newTotalXp?: number;
}

interface GamificationContextType {
  triggerXPToast: (event: Omit<XPToastEvent, "id">) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(
  undefined
);

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification must be used within GamificationProvider");
  }
  return context;
}

/**
 * Web Audio API synthesizer for clean celebratory chimes without external assets
 */
function playXpChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // First bell tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second bell tone (higher harmonized pitch)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.6);
  } catch {
    // AudioContext blocked by browser policy
  }
}

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<XPToastEvent[]>([]);

  const triggerXPToast = useCallback(
    (event: Omit<XPToastEvent, "id">) => {
      const id = `${Date.now()}-${Math.random()}`;
      const newToast: XPToastEvent = { ...event, id };

      setToasts((prev) => [...prev, newToast]);
      playXpChime();

      // Auto-dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <GamificationContext.Provider value={{ triggerXPToast }}>
      {children}
      <XPToastContainer toasts={toasts} onDismiss={removeToast} />
    </GamificationContext.Provider>
  );
}

const EVENT_LABELS: Record<XpEventType, { title: string; subtitle: string; icon: string }> = {
  QUESTION_ANSWERED: {
    title: "Correct Answer!",
    subtitle: "Speed & accuracy bonus awarded",
    icon: "⚡",
  },
  TOPIC_COMPLETED: {
    title: "Topic Mastered!",
    subtitle: "Syllabus progress unlocked",
    icon: "🏆",
  },
  DAILY_STREAK: {
    title: "Streak Kept Alive!",
    subtitle: "Consistency bonus earned",
    icon: "🔥",
  },
  DIAGNOSTIC_COMPLETED: {
    title: "Diagnostic Completed!",
    subtitle: "Readiness benchmark established",
    icon: "🎯",
  },
  MOCK_EXAM_COMPLETED: {
    title: "Mock Exam Completed!",
    subtitle: "High-yield simulation bonus",
    icon: "⭐",
  },
};

function XPToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: XPToastEvent[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        const meta = EVENT_LABELS[toast.eventType] || {
          title: "XP Earned!",
          subtitle: "Keep up the momentum",
          icon: "✨",
        };

        return (
          <div
            key={toast.id}
            className="pointer-events-auto group relative overflow-hidden rounded-2xl bg-card/95 backdrop-blur-md border border-amber-500/30 p-4 shadow-xl shadow-amber-500/10 transition-all animate-bounce-short hover:scale-102"
          >
            {/* Top Amber Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 via-amber-500 to-yellow-300" />

            <div className="flex items-start gap-3.5">
              {/* Badge Icon */}
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md shadow-amber-500/30">
                {meta.icon}
              </div>

              {/* Text Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                    PrepSmart Gamification
                  </span>
                  <button
                    type="button"
                    onClick={() => onDismiss(toast.id)}
                    className="text-muted-foreground hover:text-foreground text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                <h4 className="text-sm font-extrabold text-foreground leading-tight mt-0.5">
                  {toast.message || meta.title}
                </h4>

                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {meta.subtitle}
                </p>

                {/* Points Pill */}
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black">
                    <span>+{toast.points} XP</span>
                  </div>

                  {toast.newTotalXp !== undefined && (
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      Total: {toast.newTotalXp} XP
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default XPToastContainer;
