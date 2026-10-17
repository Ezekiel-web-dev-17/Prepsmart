"use client";

import React from "react";
import Link from "next/link";

export interface CourseCardProps {
  id: string;
  title: string;
  category: string;
  instructor: string;
  thumbnailUrl: string;
  totalLessons: number;
  completedLessons: number;
  durationMinutes: number;
  lastActiveLessonTitle: string;
  isPopular?: boolean;
}

export function CourseCard({
  id,
  title,
  category,
  instructor,
  thumbnailUrl,
  totalLessons,
  completedLessons,
  durationMinutes,
  lastActiveLessonTitle,
  isPopular = false,
}: CourseCardProps) {
  const progressPercent = Math.min(
    100,
    Math.round((completedLessons / Math.max(1, totalLessons)) * 100)
  );

  return (
    <article
      className="
        group relative flex flex-col justify-between
        rounded-3xl p-5
        bg-white/65 dark:bg-[#1C1C1E]/65
        backdrop-blur-2xl backdrop-saturate-[180%]
        border border-white/60 dark:border-white/10
        shadow-liquid-md hover:shadow-liquid-lg
        dark:shadow-liquid-dark-md dark:hover:shadow-liquid-dark-dock
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        hover:-translate-y-1.5
      "
    >
      {/* Top Media & Glass Capsule Header */}
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Micro Ambient Inner Frame Rim */}
          <div className="absolute inset-0 rounded-2xl border border-black/10 dark:border-white/15 pointer-events-none" />

          {/* Frosted Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="
              px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase
              bg-white/85 dark:bg-[#1C1C1E]/85
              text-[#1D1D1F] dark:text-[#F5F5F7]
              backdrop-blur-md border border-white/50 dark:border-white/10
              shadow-sm
            ">
              {category}
            </span>

            {isPopular && (
              <span className="
                px-2.5 py-1 rounded-full text-[11px] font-semibold
                bg-blue-600/90 text-white
                backdrop-blur-md border border-blue-400/30
                shadow-sm
              ">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Section Header: Left-Aligned Bold Apple Typography (Clarity principle) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] dark:text-[#86868B]">
            <span>{instructor}</span>
            <span>•</span>
            <span>{durationMinutes} min total</span>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] line-clamp-2 leading-snug">
            {title}
          </h3>

          <p className="text-xs text-[#6E6E73] dark:text-[#A1A1A6] line-clamp-1">
            Up Next: <span className="text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold">{lastActiveLessonTitle}</span>
          </p>
        </div>
      </div>

      {/* Progress & Action Dock */}
      <div className="mt-5 pt-4 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3.5">
        {/* Sleek Liquid Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
            <span className="text-[#6E6E73] dark:text-[#86868B]">
              {completedLessons} of {totalLessons} modules
            </span>
            <span className="text-[#0071E3] dark:text-[#2997FF]">
              {progressPercent}%
            </span>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10 p-[1px]"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Course progress: ${progressPercent}%`}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Primary Action Button: Apple HIG Tactile Form */}
        <Link
          href={`/study?course=${id}`}
          className="
            group/btn relative flex items-center justify-center gap-2 w-full py-2.5 px-4
            rounded-2xl text-xs font-semibold
            bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#0071E3] dark:hover:bg-[#2997FF]
            text-white
            shadow-sm hover:shadow-md hover:shadow-blue-500/25
            active:scale-[0.98] transition-all duration-150
            focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
          "
        >
          <span>{progressPercent > 0 ? "Continue Learning" : "Start Course"}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
export default CourseCard;
