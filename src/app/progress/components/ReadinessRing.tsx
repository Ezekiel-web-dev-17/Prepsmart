"use client";

import React, { useEffect, useState } from "react";

export interface ReadinessRingProps {
  score: number; // 0 - 100
  targetScore: number;
}

export function ReadinessRing({ score, targetScore }: ReadinessRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Mount animation trigger for smooth stroke drawing
    const timeout = setTimeout(() => {
      setAnimatedScore(score);
    }, 150);
    return () => clearTimeout(timeout);
  }, [score]);

  // SVG Geometry
  const size = 260;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  // Determine readiness tier with strictly positive phrasing
  let tierLabel = "Building Momentum";
  let tierColor = "text-blue-500 dark:text-blue-400";
  let tierBg = "bg-blue-500/10 border-blue-400/20";
  let projectedJambRange = "210 - 240";

  if (score >= 80) {
    tierLabel = "Excellence Track";
    tierColor = "text-emerald-500 dark:text-emerald-400";
    tierBg = "bg-emerald-500/10 border-emerald-400/20";
    projectedJambRange = "290 - 330";
  } else if (score >= 65) {
    tierLabel = "UTME Competitive";
    tierColor = "text-indigo-500 dark:text-indigo-400";
    tierBg = "bg-indigo-500/10 border-indigo-400/20";
    projectedJambRange = "250 - 285";
  } else if (score >= 45) {
    tierLabel = "Steady Growth";
    tierColor = "text-amber-500 dark:text-amber-400";
    tierBg = "bg-amber-500/10 border-amber-400/20";
    projectedJambRange = "220 - 250";
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md transition-all duration-500">
      {/* Specular Inner Highlight */}
      <div className="absolute inset-0 rounded-3xl border border-white/40 dark:border-white/5 pointer-events-none" />

      {/* SVG Ring Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Assessment Status
          </span>
          <h2 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Exam Readiness
          </h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierBg} ${tierColor} backdrop-blur-md`}
        >
          {tierLabel}
        </div>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center my-2">
        {/* Ambient Ring Glow */}
        <div className="absolute w-48 h-48 rounded-full bg-blue-500/15 dark:bg-blue-400/10 blur-2xl pointer-events-none animate-pulse" />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 drop-shadow-sm"
        >
          <defs>
            <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track with Liquid Depth */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-black/5 dark:text-white/10"
            fill="transparent"
          />

          {/* Animated Gauge Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#readinessGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition:
                "stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </svg>

        {/* Center Display / Score Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
            {animatedScore}
            <span className="text-2xl font-bold text-neutral-400 ml-0.5">%</span>
          </span>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mt-1">
            Readiness Index
          </span>
        </div>
      </div>

      {/* Target Comparison Indicator */}
      <div className="mt-6 w-full pt-4 border-t border-black/5 dark:border-white/10 grid grid-cols-2 gap-3 text-center">
        <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Target JAMB Score
          </span>
          <span className="text-sm sm:text-base font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tabular-nums">
            {targetScore} / 400
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            Estimated Trajectory
          </span>
          <span className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
            ~{projectedJambRange}
          </span>
        </div>
      </div>
    </div>
  );
}
