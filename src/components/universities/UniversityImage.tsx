"use client";

import { useState } from "react";
import { getUniversityImageMeta } from "@/data/university-images";
import { getUniversityLogoMeta } from "@/data/university-logos";

interface UniversityImageProps {
  slug: string;
  name: string;
  acronym?: string | null;
  className?: string;
  aspectRatio?: "card" | "hero" | "thumb" | "square" | "wide";
  showLandmarkBadge?: boolean;
  priority?: boolean;
  overlayGradient?: boolean;
  // DB-sourced fields (preferred when provided)
  dbImageUrl?: string | null;
  dbLandmark?: string | null;
  dbCaption?: string | null;
  dbBrandColor?: string | null;
  dbSecondaryColor?: string | null;
}

export default function UniversityImage({
  slug,
  name,
  acronym,
  className = "",
  aspectRatio = "card",
  showLandmarkBadge = false,
  overlayGradient = true,
  dbImageUrl,
  dbLandmark,
  dbCaption,
  dbBrandColor,
  dbSecondaryColor,
}: UniversityImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prefer DB-stored values; fall back to static data lookup
  const staticImageMeta = getUniversityImageMeta(slug, acronym);
  const staticLogoMeta = getUniversityLogoMeta(slug, acronym);

  const imageUrl = (!hasError && (dbImageUrl || staticImageMeta.imageUrl)) || null;
  const landmark = dbLandmark || staticImageMeta.landmark;
  const caption = dbCaption || staticImageMeta.caption;
  const brandColor = dbBrandColor || staticLogoMeta.brandColor;
  const secondaryColor = dbSecondaryColor || staticLogoMeta.secondaryColor;

  const initials =
    acronym ||
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

  // Aspect ratio height & container classes
  const aspectClasses =
    aspectRatio === "hero"
      ? "h-64 sm:h-80 lg:h-96 w-full"
      : aspectRatio === "thumb"
      ? "w-24 h-24 sm:w-28 sm:h-28"
      : aspectRatio === "square"
      ? "aspect-square w-full"
      : aspectRatio === "wide"
      ? "aspect-[16/7] w-full"
      : "h-36 sm:h-44 w-full"; // "card"

  // Architectural fallback if offline or failed network request
  if (!imageUrl) {
    return (
      <div
        className={`relative overflow-hidden flex flex-col justify-between p-4 ${aspectClasses} ${className}`}
        style={{
          background: `linear-gradient(135deg, ${brandColor}E6 0%, #0F172A 100%)`,
        }}
        title={`${name} — ${landmark}`}
      >
        {/* Subtle Architectural Columns Graphic Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-around px-8">
          <div className="w-6 h-full border-x-2 border-white" />
          <div className="w-6 h-full border-x-2 border-white" />
          <div className="w-6 h-full border-x-2 border-white" />
          <div className="w-6 h-full border-x-2 border-white" />
        </div>

        {/* Top bar with initials */}
        <div className="relative z-10 flex items-center justify-between">
          <span
            className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md uppercase"
            style={{
              backgroundColor: secondaryColor,
              color: "#000000",
            }}
          >
            {initials}
          </span>
        </div>

        {/* Bottom Landmark title */}
        <div className="relative z-10 space-y-0.5">
          <div className="text-white font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-sm">
            {landmark}
          </div>
          <div className="text-white/75 text-[10px] truncate max-w-full">
            {name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-muted group ${aspectClasses} ${className}`}
    >
      {/* Loading Skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Real Campus Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={`${name} Campus — ${landmark}`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Atmospheric Contrast Overlay */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
      )}

      {/* Floating Landmark Badge */}
      {showLandmarkBadge && (
        <div className="absolute bottom-2.5 right-2.5 z-10 max-w-[85%]">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold tracking-tight shadow-xs border border-white/10 truncate">
            <svg
              className="w-3 h-3 text-amber-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="truncate">{landmark}</span>
          </span>
        </div>
      )}
    </div>
  );
}

