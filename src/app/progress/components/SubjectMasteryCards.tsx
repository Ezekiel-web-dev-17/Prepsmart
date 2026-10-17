"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { SubjectMasteryItem } from "@/lib/progress";

export interface SubjectMasteryCardsProps {
  subjects: SubjectMasteryItem[];
}

export function SubjectMasteryCards({ subjects }: SubjectMasteryCardsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Visual accents per subject
  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "mathematics":
        return {
          gradient: "from-blue-600 to-cyan-500",
          barColor: "bg-blue-500",
          glow: "bg-blue-500/10",
          textColor: "text-blue-600 dark:text-blue-400",
          badgeBg: "bg-blue-500/10 border-blue-400/20 text-blue-700 dark:text-blue-300",
        };
      case "use of english":
        return {
          gradient: "from-indigo-600 to-purple-500",
          barColor: "bg-indigo-500",
          glow: "bg-indigo-500/10",
          textColor: "text-indigo-600 dark:text-indigo-400",
          badgeBg: "bg-indigo-500/10 border-indigo-400/20 text-indigo-700 dark:text-indigo-300",
        };
      case "physics":
        return {
          gradient: "from-violet-600 to-fuchsia-500",
          barColor: "bg-violet-500",
          glow: "bg-violet-500/10",
          textColor: "text-violet-600 dark:text-violet-400",
          badgeBg: "bg-violet-500/10 border-violet-400/20 text-violet-700 dark:text-violet-300",
        };
      case "chemistry":
        return {
          gradient: "from-emerald-600 to-teal-500",
          barColor: "bg-emerald-500",
          glow: "bg-emerald-500/10",
          textColor: "text-emerald-600 dark:text-emerald-400",
          badgeBg: "bg-emerald-500/10 border-emerald-400/20 text-emerald-700 dark:text-emerald-300",
        };
      case "biology":
        return {
          gradient: "from-green-600 to-lime-500",
          barColor: "bg-green-500",
          glow: "bg-green-500/10",
          textColor: "text-green-600 dark:text-green-400",
          badgeBg: "bg-green-500/10 border-green-400/20 text-green-700 dark:text-green-300",
        };
      default:
        return {
          gradient: "from-amber-600 to-orange-500",
          barColor: "bg-amber-500",
          glow: "bg-amber-500/10",
          textColor: "text-amber-600 dark:text-amber-400",
          badgeBg: "bg-amber-500/10 border-amber-400/20 text-amber-700 dark:text-amber-300",
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Syllabus Precision
          </span>
          <h2 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Subject Mastery Breakdown
          </h2>
        </div>
        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          {subjects.length} Selected Subjects
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((item) => {
          const color = getSubjectColor(item.subject);

          return (
            <div
              key={item.subject}
              className="
                group relative p-5 sm:p-6 rounded-3xl
                bg-white/65 dark:bg-[#1C1C1E]/65
                backdrop-blur-2xl backdrop-saturate-180
                border border-white/60 dark:border-white/10
                shadow-liquid-md hover:shadow-liquid-lg
                dark:shadow-liquid-dark-md dark:hover:shadow-liquid-dark-dock
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-1
              "
            >
              {/* Specular Inner Rim */}
              <div className="absolute inset-0 rounded-3xl border border-white/40 dark:border-white/5 pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.subject}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {item.questionsAttempted > 0
                        ? `${item.questionsAttempted} Questions Practiced`
                        : "Ready for Initial Diagnostic"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${color.badgeBg}`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-neutral-600 dark:text-neutral-300">
                      Mastery Score
                    </span>
                    <span className={`text-base font-black tabular-nums ${color.textColor}`}>
                      {item.masteryPct}%
                    </span>
                  </div>

                  {/* Progress Track */}
                  <div className="relative h-3 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden p-0.5 border border-black/5 dark:border-white/5">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${color.gradient} shadow-xs transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                      style={{
                        width: isMounted ? `${item.masteryPct}%` : "0%",
                      }}
                    />
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-black/5 dark:border-white/10">
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    {item.masteredCount > 0
                      ? `${item.masteredCount} concepts confirmed`
                      : "Syllabus active"}
                  </span>

                  <Link
                    href={`/quiz/${encodeURIComponent(item.subject)}`}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group/btn"
                  >
                    <span>Launch Drill</span>
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
