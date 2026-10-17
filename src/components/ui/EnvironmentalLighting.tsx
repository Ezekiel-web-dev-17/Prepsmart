"use client";

import React from "react";

export interface EnvironmentalLightingProps {
  children: React.ReactNode;
  isFocusMode?: boolean;
}

export function EnvironmentalLighting({
  children,
  isFocusMode = false,
}: EnvironmentalLightingProps) {
  return (
    <div className="relative min-h-screen w-full bg-[#F5F5F7] text-[#1D1D1F] dark:bg-[#000000] dark:text-[#F5F5F7] transition-colors duration-700 overflow-x-hidden selection:bg-blue-500/20">
      {/* Dynamic Background Mesh Orbs (Refracted by Liquid Glass) */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
          isFocusMode ? "opacity-15" : "opacity-75 dark:opacity-45"
        }`}
      >
        {/* Academic Indigo Orb */}
        <div className="absolute -top-[15%] left-[8%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-blue-600/35 to-indigo-400/25 blur-[120px] will-change-transform animate-pulse" />
        {/* Warm Amber Mastery Orb */}
        <div className="absolute top-[35%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-amber-400/25 via-rose-400/20 to-purple-500/20 blur-[130px] will-change-transform" />
        {/* Emerald Retention Orb */}
        <div className="absolute -bottom-[10%] left-[25%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-400/20 blur-[140px] will-change-transform" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
