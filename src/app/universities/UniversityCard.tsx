"use client";

import Link from "next/link";
import type { UniversityData } from "./types";
import UniversityLogo from "@/components/universities/UniversityLogo";
import UniversityImage from "@/components/universities/UniversityImage";

interface UniversityCardProps {
  university: UniversityData;
  targetScore: number | null;
  viewMode?: "grid" | "list";
}

export default function UniversityCard({
  university,
  targetScore,
  viewMode = "grid",
}: UniversityCardProps) {
  const isEligible =
    targetScore !== null ? targetScore >= university.generalCutOff : null;
  const scoreDiff =
    targetScore !== null ? targetScore - university.generalCutOff : null;

  const typeColorClasses =
    university.type === "federal"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : university.type === "state"
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

  const typeLabel =
    university.type.charAt(0).toUpperCase() + university.type.slice(1);

  // Generate a distinct monogram from acronym or initials
  const initials =
    university.acronym ||
    university.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

  if (viewMode === "list") {
    return (
      <div className="group rounded-2xl bg-card border border-border/80 hover:border-blue-500/50 p-4 sm:p-5 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Info */}
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          {/* University Campus Image Thumbnail + Emblem Badge */}
          <div className="relative shrink-0 hidden sm:block">
            <UniversityImage
              slug={university.slug}
              name={university.name}
              acronym={university.acronym}
              aspectRatio="thumb"
              className="rounded-xl w-20 h-20 sm:w-24 sm:h-24 object-cover border border-border/80 shadow-2xs"
              overlayGradient={true}
              dbImageUrl={university.imageUrl}
              dbLandmark={university.imageLandmark}
              dbCaption={university.imageCaption}
              dbBrandColor={university.brandColor}
              dbSecondaryColor={university.secondaryColor}
            />
            <div className="absolute -bottom-2 -right-2 ring-2 ring-card rounded-lg bg-card shadow-xs">
              <UniversityLogo
                slug={university.slug}
                name={university.name}
                acronym={university.acronym}
                size="sm"
                dbLogoUrl={university.logoUrl}
                dbBrandColor={university.brandColor}
                dbSecondaryColor={university.secondaryColor}
              />
            </div>
          </div>

          {/* Mobile-only Logo */}
          <div className="sm:hidden shrink-0">
            <UniversityLogo
              slug={university.slug}
              name={university.name}
              acronym={university.acronym}
              size="md"
              dbLogoUrl={university.logoUrl}
              dbBrandColor={university.brandColor}
              dbSecondaryColor={university.secondaryColor}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border ${typeColorClasses}`}
              >
                {typeLabel}
              </span>
              {university.zone && (
                <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {university.zone}
                </span>
              )}
              {isEligible !== null && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${isEligible
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                    }`}
                >
                  {isEligible
                    ? `Eligible (+${scoreDiff} pts)`
                    : `Needs +${Math.abs(scoreDiff || 0)} pts`}
                </span>
              )}
            </div>
            <Link
              href={`/universities/${university.slug}`}
              className="font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base sm:text-lg block truncate"
            >
              {university.name}
            </Link>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {university.city}, {university.state} • Est. {university.estYear || "N/A"} •{" "}
              {university.screeningType}
            </p>
          </div>
        </div>

        {/* Right: Metrics & CTA */}
        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
          <div className="text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
              JAMB Cut-Off
            </span>
            <div className="text-lg font-black text-foreground tabular-nums">
              {university.generalCutOff}
              <span className="text-xs font-semibold text-muted-foreground ml-1">
                pts
              </span>
            </div>
          </div>

          <div className="hidden sm:block text-left md:text-right">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
              Est. Tuition
            </span>
            <div className="text-xs font-semibold text-foreground truncate max-w-35">
              {university.annualTuitionEst || "Subsidized"}
            </div>
          </div>

          <Link
            href={`/universities/${university.slug}`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <span>Explore</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Grid View Mode
  return (
    <div className="group rounded-2xl bg-card border border-border/80 hover:border-blue-500/40 transition-all duration-200 shadow-xs hover:shadow-lg flex flex-col justify-between relative overflow-hidden">
      {/* 1. Real Campus Cover Image */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-muted shrink-0">
        <UniversityImage
          slug={university.slug}
          name={university.name}
          acronym={university.acronym}
          aspectRatio="card"
          showLandmarkBadge={true}
          dbImageUrl={university.imageUrl}
          dbLandmark={university.imageLandmark}
          dbCaption={university.imageCaption}
          dbBrandColor={university.brandColor}
          dbSecondaryColor={university.secondaryColor}
        />

        {/* Floating Badges on Image */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs border ${university.type === "federal"
              ? "bg-blue-950/80 text-blue-200 border-blue-500/40"
              : university.type === "state"
                ? "bg-emerald-950/80 text-emerald-200 border-emerald-500/40"
                : "bg-purple-950/80 text-purple-200 border-purple-500/40"
              }`}
          >
            {typeLabel}
          </span>
          {university.zone && (
            <span className="text-[10px] font-semibold text-white/95 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/15">
              {university.zone}
            </span>
          )}
        </div>
      </div>

      {/* Card Content with Overlapping Official Emblem */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Official Emblem Overlap + Cut-Off Pill */}
          <div className="flex items-end justify-between -mt-9 mb-3 relative z-10">
            <div className="ring-4 ring-card rounded-xl shadow-md bg-card">
              <UniversityLogo
                slug={university.slug}
                name={university.name}
                acronym={university.acronym}
                size="md"
                dbLogoUrl={university.logoUrl}
                dbBrandColor={university.brandColor}
                dbSecondaryColor={university.secondaryColor}
              />
            </div>

            {/* General Cut-Off Pill */}
            <div className="text-right bg-card/95 backdrop-blur-xs border border-border/80 px-2.5 py-1 rounded-xl shadow-xs">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                JAMB Cut-Off
              </span>
              <div className="text-base sm:text-lg font-black text-foreground tabular-nums leading-none">
                {university.generalCutOff}
                <span className="text-[10px] font-semibold text-muted-foreground ml-0.5">pts</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 font-medium">
            <svg
              className="w-3.5 h-3.5 shrink-0 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {university.city}, {university.state}
            </span>
          </div>

          {/* Institution Title */}
          <Link
            href={`/universities/${university.slug}`}
            className="font-bold text-base sm:text-lg text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 block mb-1"
            title={university.name}
          >
            {university.name}
          </Link>

          {/* Eligibility Pill Banner if user provided score */}
          {isEligible !== null && (
            <div
              className={`mt-2 mb-3 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${isEligible
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30"
                }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isEligible ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                />
                <span>{isEligible ? "Eligible" : "Below Minimum"}</span>
              </div>
              <span className="font-bold">
                {isEligible
                  ? `+${scoreDiff} pts above`
                  : `${Math.abs(scoreDiff || 0)} pts needed`}
              </span>
            </div>
          )}

          {/* Highlights / Screening details */}
          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
            {university.campusHighlights ||
              `${university.name} tertiary educational institution with modern faculties and research facilities.`}
          </p>

          {/* Course cutoffs chips */}
          {university.courses && university.courses.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/60">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center justify-between">
                <span>Departmental Cut-offs</span>
                <span>{university.courses.length} Listed</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {university.courses.slice(0, 3).map((course) => {
                  const meetsCourse =
                    targetScore !== null
                      ? targetScore >= course.cutOffMark
                      : null;
                  return (
                    <span
                      key={course.id}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${meetsCourse === true
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : meetsCourse === false
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                          : "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                      {course.courseName.split(" ")[0]}: {course.cutOffMark}
                    </span>
                  );
                })}
                {university.courses.length > 3 && (
                  <span className="text-[10px] text-muted-foreground px-1.5 py-0.5">
                    +{university.courses.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Screening
            </div>
            <div className="text-xs font-semibold text-foreground truncate max-w-32.5 sm:max-w-40">
              {university.screeningType}
            </div>
          </div>

          <Link
            href={`/universities/${university.slug}`}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm shrink-0 flex items-center gap-1"
          >
            <span>View Hub</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
