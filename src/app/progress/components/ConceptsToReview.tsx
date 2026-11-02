"use client";

import React from "react";
import Link from "next/link";
import type { ConceptToReviewItem } from "@/lib/progress";
import {
  TargetIcon,
  BookOpenIcon,
  RocketIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@/components/ui/icons";

export interface ConceptsToReviewProps {
  concepts: ConceptToReviewItem[];
}

export function ConceptsToReview({ concepts }: ConceptsToReviewProps) {
  const hasConcepts = concepts && concepts.length > 0;

  return (
    <div className="relative flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md transition-all duration-300">
      {/* Specular Inner Highlight */}
      <div className="absolute inset-0 rounded-3xl border border-white/40 dark:border-white/5 pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              Areas for Growth
            </span>
            <h2 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Concepts to Review
            </h2>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <TargetIcon className="w-3.5 h-3.5" />
            <span>High-Yield Focus</span>
          </span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-5 leading-relaxed">
          These top concepts offer your highest point gains. Targeted recall and
          active problem-solving will solidify your exam readiness.
        </p>

        {/* Real Concepts List or Empty State */}
        {!hasConcepts ? (
          <div className="p-8 text-center rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4 my-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-500/20">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Your Revision Queue is Clear
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                You have no pending concepts to review right now. Begin studying your syllabus modules or take a timed CBT mock exam to identify growth areas and build your personalized revision queue.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <Link
                href="/study"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <BookOpenIcon className="w-3.5 h-3.5" />
                <span>Begin Studying Curriculum</span>
              </Link>
              <Link
                href="/study?tab=mock-exam"
                className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-all flex items-center gap-1.5"
              >
                <RocketIcon className="w-3.5 h-3.5" />
                <span>Take CBT Mock Exam</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {concepts.map((item, idx) => (
              <div
                key={`${item.subject}-${item.concept}-${idx}`}
                className="group p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all duration-300 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center shrink-0 border border-blue-500/20">
                    0{idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.concept}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate">
                        {item.subject} • {item.topic}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/70 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-black/5 dark:border-white/10">
                    {item.reviewCount > 0
                      ? `${item.reviewCount} Practice cue${item.reviewCount > 1 ? "s" : ""}`
                      : "Recorded Error"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Glass-morphic Call To Action Button */}
      {hasConcepts && (
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10">
          <Link
            href="/dashboard?tab=revision"
            className="
              w-full py-3.5 px-5 rounded-2xl
              bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
              text-white font-bold text-xs sm:text-sm tracking-wide
              shadow-liquid-sm hover:shadow-liquid-md
              border border-blue-400/30
              flex items-center justify-center gap-2
              transition-all duration-300 ease-out
              hover:scale-[1.01] active:scale-[0.99]
            "
          >
            <span>Master these concepts in the Revision Hub</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
