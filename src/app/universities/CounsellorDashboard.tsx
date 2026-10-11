"use client";

import { useState, useMemo } from "react";
import UniversityCard from "./UniversityCard";
import {
  type UniversityData,
  POPULAR_COURSES,
  UNIVERSITY_TYPES,
  GEOPOLITICAL_ZONES,
} from "./types";

interface CounsellorDashboardProps {
  initialUniversities: UniversityData[];
}

export default function CounsellorDashboard({
  initialUniversities,
}: CounsellorDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("All Zones");
  const [selectedScreening, setSelectedScreening] = useState<string>("all");
  const [jambScoreInput, setJambScoreInput] = useState<string>("");
  const [onlyEligible, setOnlyEligible] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<string>("cutoff_desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const parsedTargetScore = useMemo(() => {
    const num = parseInt(jambScoreInput, 10);
    return !isNaN(num) && num > 0 ? num : null;
  }, [jambScoreInput]);

  const filteredUniversities = useMemo(() => {
    return initialUniversities
      .filter((uni) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        if (query) {
          const matchesName = uni.name.toLowerCase().includes(query);
          const matchesAcronym = uni.acronym
            ? uni.acronym.toLowerCase().includes(query)
            : false;
          const matchesCity = uni.city.toLowerCase().includes(query);
          const matchesState = uni.state.toLowerCase().includes(query);
          if (!matchesName && !matchesAcronym && !matchesCity && !matchesState) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== "all" && uni.type !== selectedType) {
          return false;
        }

        // Zone filter
        if (
          selectedZone !== "All Zones" &&
          selectedZone !== "all" &&
          uni.zone !== selectedZone
        ) {
          return false;
        }

        // Course filter
        if (selectedCourse !== "all") {
          const offersCourse = uni.courses.some((c) =>
            c.courseName.toLowerCase().includes(selectedCourse.toLowerCase())
          );
          if (!offersCourse) {
            return false;
          }
        }

        // Screening type filter
        if (selectedScreening !== "all") {
          if (
            selectedScreening === "cbt" &&
            !uni.screeningType.toLowerCase().includes("cbt")
          ) {
            return false;
          }
          if (
            selectedScreening === "screening" &&
            uni.screeningType.toLowerCase().includes("cbt")
          ) {
            return false;
          }
        }

        // Eligibility filter
        if (onlyEligible && parsedTargetScore !== null) {
          if (parsedTargetScore < uni.generalCutOff) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "cutoff_desc") {
          return b.generalCutOff - a.generalCutOff;
        }
        if (sortOption === "cutoff_asc") {
          return a.generalCutOff - b.generalCutOff;
        }
        if (sortOption === "name_asc") {
          return a.name.localeCompare(b.name);
        }
        if (sortOption === "est_year") {
          return (a.estYear || 9999) - (b.estYear || 9999);
        }
        return 0;
      });
  }, [
    initialUniversities,
    searchQuery,
    selectedType,
    selectedZone,
    selectedCourse,
    selectedScreening,
    onlyEligible,
    parsedTargetScore,
    sortOption,
  ]);

  const stats = useMemo(() => {
    const total = filteredUniversities.length;
    const federal = filteredUniversities.filter((u) => u.type === "federal").length;
    const state = filteredUniversities.filter((u) => u.type === "state").length;
    const priv = filteredUniversities.filter((u) => u.type === "private").length;
    const eligibleCount =
      parsedTargetScore !== null
        ? filteredUniversities.filter((u) => parsedTargetScore >= u.generalCutOff).length
        : null;

    return { total, federal, state, priv, eligibleCount };
  }, [filteredUniversities, parsedTargetScore]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedCourse("all");
    setSelectedZone("All Zones");
    setSelectedScreening("all");
    setJambScoreInput("");
    setOnlyEligible(false);
    setSortOption("cutoff_desc");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            JAMB Admission Counsellor
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Discover Your Target Universities & Cut-Off Marks
          </h1>

          <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
            Compare general cut-offs, evaluate departmental criteria for high-demand
            programmes, examine Post-UTME CBT screening formats, and verify your
            mandatory screening document checklist.
          </p>

          {/* Quick Score Qualifier Input */}
          <div className="pt-2 sm:pt-4">
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 max-w-xl">
              <label
                htmlFor="target-score"
                className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2"
              >
                Enter your target or actual JAMB score
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-1">
                  <input
                    id="target-score"
                    type="number"
                    min="100"
                    max="400"
                    value={jambScoreInput}
                    onChange={(e) => setJambScoreInput(e.target.value)}
                    placeholder="e.g. 240 (Score out of 400)"
                    className="w-full pl-3.5 pr-14 py-2.5 rounded-xl bg-slate-900/80 border border-blue-400/30 text-white placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-400 font-semibold"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                    / 400
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1 sm:py-0">
                  {[180, 200, 240, 280].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setJambScoreInput(score.toString())}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        jambScoreInput === score.toString()
                          ? "bg-blue-500 text-white border-blue-400 shadow-xs"
                          : "bg-white/5 hover:bg-white/15 text-blue-200 border-white/10"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                  {jambScoreInput && (
                    <button
                      type="button"
                      onClick={() => setJambScoreInput("")}
                      className="px-2 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 transition-all cursor-pointer"
                      title="Clear score"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {parsedTargetScore !== null && (
                <div className="mt-3 flex items-center justify-between text-xs text-blue-200 pt-2 border-t border-white/10">
                  <span>
                    Qualifying institutions for <strong>{parsedTargetScore} pts</strong>:{" "}
                    <span className="font-bold text-emerald-400">
                      {stats.eligibleCount} of {initialUniversities.length}
                    </span>
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-white hover:text-blue-300">
                    <input
                      type="checkbox"
                      checked={onlyEligible}
                      onChange={(e) => setOnlyEligible(e.target.checked)}
                      className="rounded accent-blue-500"
                    />
                    <span>Filter strictly eligible</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Control Hub */}
      <section className="bg-card border border-border/80 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Search & Main Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, acronym (e.g. UNILAG), state, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort & View Mode Switches */}
          <div className="flex items-center gap-2.5 shrink-0 justify-between sm:justify-end">
            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                aria-label="Sort universities"
                className="px-3 py-2 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="cutoff_desc">Highest Cut-Off First</option>
                <option value="cutoff_asc">Lowest Cut-Off First</option>
                <option value="name_asc">Institution Name (A-Z)</option>
                <option value="est_year">Year Established</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Filter Controls Row */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          {/* Institution Type Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {UNIVERSITY_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === type.id
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Dropdown Filters: Course, Zone, Screening */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Degree Course Dropdown */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              aria-label="Filter by degree course"
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Programmes</option>
              {POPULAR_COURSES.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

            {/* Geopolitical Zone Dropdown */}
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              aria-label="Filter by geopolitical zone"
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {GEOPOLITICAL_ZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>

            {/* Screening Format Dropdown */}
            <select
              value={selectedScreening}
              onChange={(e) => setSelectedScreening(e.target.value)}
              aria-label="Filter by screening format"
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-semibold text-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Screening Formats</option>
              <option value="cbt">Post-UTME CBT Exam Only</option>
              <option value="screening">Credentials / Aggregate Screening</option>
            </select>

            {/* Reset Filters button if any active */}
            {(searchQuery ||
              selectedType !== "all" ||
              selectedCourse !== "all" ||
              selectedZone !== "All Zones" ||
              selectedScreening !== "all" ||
              onlyEligible ||
              jambScoreInput) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline px-2 py-1 cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div>
          Showing{" "}
          <strong className="text-foreground">{stats.total}</strong> of{" "}
          {initialUniversities.length} tertiary institutions
          {selectedType !== "all" && ` (${selectedType})`}
          {selectedCourse !== "all" && ` offering ${selectedCourse}`}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Federal: {stats.federal}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            State: {stats.state}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Private: {stats.priv}
          </span>
        </div>
      </div>

      {/* Main University List / Grid */}
      {filteredUniversities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              No matching universities found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              We couldn&apos;t find any higher institutions matching your active
              filters. Try adjusting your target cut-off score, searching a
              broader keyword, or clearing the filters.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUniversities.map((uni) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              targetScore={parsedTargetScore}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredUniversities.map((uni) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              targetScore={parsedTargetScore}
              viewMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
