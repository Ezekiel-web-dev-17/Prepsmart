"use client";

import React from "react";

export interface MotivationalBannerProps {
  message: string;
  weeklyQuestionsCount: number;
  activeStreak: number;
  xp: number;
}

export function MotivationalBanner({
  message,
  weeklyQuestionsCount,
  activeStreak,
  xp,
}: MotivationalBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md transition-all duration-300">
      {/* Background Soft Refraction Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 rounded-3xl border border-white/40 dark:border-white/5 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Copy & Encouragement */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-700 dark:text-blue-300 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Candidate Momentum</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
            Consistency Drives Exam Readiness.
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
            {message}
          </p>
        </div>

        {/* Right Stats Quick Pillows */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Questions this week */}
          <div className="px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center min-w-28 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums block leading-none">
              {weeklyQuestionsCount}
            </span>
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mt-1.5">
              This Week
            </span>
          </div>

          {/* Active streak */}
          <div className="px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center min-w-28 shadow-sm">
            <div className="flex items-center justify-center gap-1 leading-none">
              <span className="text-2xl sm:text-3xl font-black text-amber-500 tabular-nums">
                {activeStreak}
              </span>
              <span className="text-lg">🔥</span>
            </div>
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mt-1.5">
              Day Streak
            </span>
          </div>

          {/* XP Accumulated */}
          <div className="px-5 py-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center min-w-28 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums block leading-none">
              {xp}
            </span>
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mt-1.5">
              Total XP
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
