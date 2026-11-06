"use client";

import { useState } from "react";
import { getUniversityLogoMeta } from "@/data/university-logos";
import { GraduationCapIcon } from "@/components/ui/icons";

interface UniversityLogoProps {
  slug: string;
  name: string;
  acronym?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
  // DB-sourced fields (preferred when provided)
  dbLogoUrl?: string | null;
  dbBrandColor?: string | null;
  dbSecondaryColor?: string | null;
}

export default function UniversityLogo({
  slug,
  name,
  acronym,
  className = "",
  size = "md",
  dbLogoUrl,
  dbBrandColor,
  dbSecondaryColor,
}: UniversityLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Prefer DB-stored values; fall back to static data lookup
  const staticMeta = getUniversityLogoMeta(slug, acronym);
  const logoUrl = !hasError ? (dbLogoUrl || staticMeta.logoUrl) : null;
  const brandColor = dbBrandColor || staticMeta.brandColor;
  const secondaryColor = dbSecondaryColor || staticMeta.secondaryColor;

  const sizeClasses =
    size === "sm"
      ? "w-9 h-9 text-xs"
      : size === "lg"
      ? "w-16 h-16 text-base"
      : "w-12 h-12 text-sm";

  const displayInitials =
    acronym ||
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

  if (!logoUrl) {
    return (
      <div
        className={`${sizeClasses} rounded-xl flex flex-col items-center justify-center font-black shrink-0 border border-border shadow-xs text-white p-1 text-center select-none ${className}`}
        style={{
          backgroundColor: brandColor,
          borderColor: secondaryColor,
        }}
        title={name}
      >
        <span className="leading-none tracking-tight">{displayInitials.slice(0, 4)}</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-xl bg-white dark:bg-card border border-border/80 flex items-center justify-center p-1 shrink-0 overflow-hidden shadow-xs relative group ${className}`}
      title={name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${name} official emblem`}
        loading="lazy"
        onError={() => setHasError(true)}
        className="w-full h-full object-contain filter drop-shadow-2xs transition-transform group-hover:scale-105"
      />
    </div>
  );
}

