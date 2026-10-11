"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { UniversityData, CourseRequirementData } from "../types";

interface UniversityDetailViewProps {
  university: UniversityData;
}

export default function UniversityDetailView({
  university,
}: UniversityDetailViewProps) {
  // Score checker state
  const [candidateScore, setCandidateScore] = useState<string>("");
  const [courseSearch, setCourseSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"courses" | "checklist" | "overview">("courses");
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>("All");

  // Document checklist state with localStorage persistence
  const storageKey = `prepsmart_docs_${university.slug}`;
  const [checkedDocIds, setCheckedDocIds] = useState<Record<string, boolean>>({});
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedDocIds(JSON.parse(saved));
      }
    } catch {
      // LocalStorage access fallback
    } finally {
      setIsLoadedFromStorage(true);
    }
  }, [storageKey]);

  const toggleDoc = (docId: string) => {
    setCheckedDocIds((prev) => {
      const next = { ...prev, [docId]: !prev[docId] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  const markAllDocs = (status: boolean) => {
    const next: Record<string, boolean> = {};
    university.documents.forEach((d) => {
      next[d.id] = status;
    });
    setCheckedDocIds(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Fallback
    }
  };

  const parsedScore = useMemo(() => {
    const num = parseInt(candidateScore, 10);
    return !isNaN(num) && num > 0 ? num : null;
  }, [candidateScore]);

  const filteredCourses = useMemo(() => {
    return university.courses.filter((course) => {
      const query = courseSearch.toLowerCase().trim();
      if (!query) return true;
      return (
        course.courseName.toLowerCase().includes(query) ||
        (course.faculty && course.faculty.toLowerCase().includes(query)) ||
        (course.oLevelRequirements &&
          course.oLevelRequirements.toLowerCase().includes(query))
      );
    });
  }, [university.courses, courseSearch]);

  const qualifyingCoursesCount = useMemo(() => {
    if (parsedScore === null) return null;
    return university.courses.filter((c) => parsedScore >= c.cutOffMark).length;
  }, [university.courses, parsedScore]);

  // Document checklist progress
  const totalDocs = university.documents.length;
  const completedDocsCount = Object.values(checkedDocIds).filter(Boolean).length;
  const progressPercent = totalDocs > 0 ? Math.round((completedDocsCount / totalDocs) * 100) : 0;

  const docCategories = useMemo(() => {
    const cats = new Set(university.documents.map((d) => d.category));
    return ["All", ...Array.from(cats)];
  }, [university.documents]);

  const filteredDocuments = useMemo(() => {
    if (selectedDocCategory === "All") return university.documents;
    return university.documents.filter((d) => d.category === selectedDocCategory);
  }, [university.documents, selectedDocCategory]);

  const initials =
    university.acronym ||
    university.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 3)
      .join("")
      .toUpperCase();

  const typeColorClasses =
    university.type === "federal"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      : university.type === "state"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/universities" className="hover:text-foreground transition-colors">
          Admission Counsellor
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate max-w-50 sm:max-w-none">
          {university.name}
        </span>
      </nav>

      {/* University Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5 flex-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-slate-900 text-white font-black text-xl sm:text-2xl flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              {initials.slice(0, 4)}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${typeColorClasses}`}
                >
                  {university.type} University
                </span>
                {university.zone && (
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                    {university.zone}
                  </span>
                )}
                {university.estYear && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                    Est. {university.estYear}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {university.name}
                {university.acronym && (
                  <span className="text-muted-foreground font-bold ml-2 text-lg sm:text-2xl">
                    ({university.acronym})
                  </span>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-muted-foreground shrink-0"
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
                  {university.city}, {university.state} State, Nigeria
                </span>
              </p>
            </div>
          </div>

          {/* Quick Metrics & Links */}
          <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between sm:justify-start gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-border/60 shrink-0">
            <div className="flex items-center gap-4">
              <div className="text-left lg:text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                  General JAMB Cut-Off
                </span>
                <div className="text-2xl font-black text-foreground tabular-nums">
                  {university.generalCutOff}
                  <span className="text-xs font-bold text-muted-foreground ml-1">
                    pts
                  </span>
                </div>
              </div>

              <div className="text-left lg:text-right border-l lg:border-l-0 pl-4 lg:pl-0 border-border/60">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block tracking-wider">
                  Tuition Estimate
                </span>
                <div className="text-sm font-bold text-foreground">
                  {university.annualTuitionEst || "Subsidized"}
                </div>
              </div>
            </div>

            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <span>Official Portal</span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Screening Protocol Banner */}
        <div className="mt-6 pt-5 border-t border-border/60">
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Admission Screening Protocol
                </span>
                <h2 className="text-sm font-bold text-foreground">
                  {university.screeningType}
                </h2>
              </div>
            </div>

            <div className="text-xs text-blue-900 dark:text-blue-200 font-medium bg-blue-100 dark:bg-blue-900/50 px-3 py-1.5 rounded-xl">
              {university.postUtmeRequired
                ? "Physical CBT Examination Scheduled"
                : "Point-Based Online Aggregate Verification"}
            </div>
          </div>
        </div>
      </div>

      {/* Target Score Dynamic Evaluator */}
      <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">
            Test Your Score Against {university.acronym || university.name} Cut-Offs
          </h3>
          <p className="text-xs text-muted-foreground">
            Enter your JAMB score to see which degree courses you qualify for.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <input
              type="number"
              min="100"
              max="400"
              value={candidateScore}
              onChange={(e) => setCandidateScore(e.target.value)}
              placeholder="e.g. 260"
              className="w-32 pl-3 pr-8 py-2 rounded-xl bg-background border border-border text-foreground text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-2.5 top-2 text-xs font-semibold text-muted-foreground">
              /400
            </span>
          </div>

          {parsedScore !== null && (
            <div
              className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                parsedScore >= university.generalCutOff
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              }`}
            >
              {parsedScore >= university.generalCutOff
                ? `Eligible for ${qualifyingCoursesCount} of ${university.courses.length} courses`
                : `Below General Cut-Off (${university.generalCutOff})`}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-border/80 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "courses"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Courses & Cut-Offs</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-semibold">
            {university.courses.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("checklist")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "checklist"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Screening Document Checklist</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              progressPercent === 100
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-muted"
            }`}
          >
            {completedDocsCount}/{totalDocs}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "overview"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Campus & Strategy</span>
        </button>
      </div>

      {/* Tab 1: Departmental Courses Directory */}
      {activeTab === "courses" && (
        <div className="space-y-5">
          {/* Search Bar for Courses */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="Search programmes (e.g. Medicine, Law, Engineering)..."
                className="w-full pl-3.5 pr-4 py-2 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredCourses.length}</strong> programmes
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
              No degree courses found matching &quot;{courseSearch}&quot;.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const isCourseEligible =
                  parsedScore !== null ? parsedScore >= course.cutOffMark : null;

                return (
                  <div
                    key={course.id}
                    className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3.5 hover:border-blue-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {course.faculty && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                            {course.faculty}
                          </span>
                        )}
                        <h4 className="font-extrabold text-base text-foreground">
                          {course.courseName}
                        </h4>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Cut-Off
                        </span>
                        <span className="text-xl font-black text-foreground tabular-nums">
                          {course.cutOffMark}
                        </span>
                      </div>
                    </div>

                    {/* Eligibility Badge if score entered */}
                    {isCourseEligible !== null && parsedScore !== null && (
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                          isCourseEligible
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span>
                          {isCourseEligible ? "Eligible for Admission" : "Below Course Cut-Off"}
                        </span>
                        <span className="font-bold">
                          {isCourseEligible
                            ? `+${parsedScore - course.cutOffMark} pts`
                            : `${course.cutOffMark - parsedScore} pts needed`}
                        </span>
                      </div>
                    )}

                    {/* Programme Details */}
                    <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                      <div>
                        <span className="font-bold text-foreground">
                          O&apos;Level Subject Criteria:
                        </span>
                        <p className="text-muted-foreground mt-0.5 leading-relaxed">
                          {course.oLevelRequirements ||
                            "5 SSCE credits in relevant subject combination in not more than 2 sittings."}
                        </p>
                      </div>

                      {course.directEntryAccepted && (
                        <div>
                          <span className="font-bold text-foreground">
                            Direct Entry (DE) Pathway:
                          </span>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">
                            {course.directEntryRequirements ||
                              "JUPEB / IJMB / ND Upper Credit in relevant discipline."}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-muted-foreground text-[11px] pt-1">
                        <span>Duration: <strong>{course.durationYears} Years</strong></span>
                        <span>Direct Entry: <strong>{course.directEntryAccepted ? "Accepted" : "UTME Only"}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Screening Document Checklist */}
      {activeTab === "checklist" && (
        <div className="space-y-6">
          {/* Checklist Progress Tracker Card */}
          <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  Official Screening & Verification Dossier
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tick off documents as you gather them. Your progress is saved automatically in your browser.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => markAllDocs(true)}
                  className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  Mark All Complete
                </button>
                <button
                  type="button"
                  onClick={() => markAllDocs(false)}
                  className="px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-muted-foreground">Screening Readiness</span>
                <span className={progressPercent === 100 ? "text-emerald-500" : "text-foreground"}>
                  {completedDocsCount} of {totalDocs} Documents ({progressPercent}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    progressPercent === 100
                      ? "bg-emerald-500"
                      : "bg-linear-to-r from-blue-600 to-indigo-600"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {docCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedDocCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDocCategory === cat
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Interactive Document List */}
          <div className="space-y-3">
            {filteredDocuments.map((doc) => {
              const isChecked = !!checkedDocIds[doc.id];

              return (
                <div
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/30"
                      : "bg-card border-border/80 hover:border-blue-500/40"
                  }`}
                >
                  {/* Checkbox Icon */}
                  <div className="mt-0.5 shrink-0">
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                          : "border-border bg-background"
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Document Information */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {doc.category}
                      </span>
                      {doc.isRequired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Conditional / DE
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-bold transition-colors ${
                        isChecked
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {doc.title}
                    </h4>

                    {doc.description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Campus Overview & Highlights */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border/80 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-foreground">
              Campus Highlights & Strategic Profile
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {university.campusHighlights ||
                `${university.name} is a premier Nigerian tertiary institution offering comprehensive undergraduate and postgraduate programmes across accredited faculties.`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  Location
                </span>
                <span className="text-sm font-bold text-foreground">
                  {university.city}, {university.state} State
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  Screening Method
                </span>
                <span className="text-sm font-bold text-foreground">
                  {university.screeningType}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border border-border">
                <span className="text-[10px] font-bold uppercase text-muted-foreground block">
                  Est. Annual Tuition
                </span>
                <span className="text-sm font-bold text-foreground">
                  {university.annualTuitionEst || "Federal Subsidized"}
                </span>
              </div>
            </div>
          </div>

          {/* Admission Tips Box */}
          <div className="rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Prepsmart Counsellor Strategy Guide</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong>O&apos;Level Sitting Count:</strong> Verify whether your chosen course allows one sitting or two sittings (Medicine and Pharmacy generally require single sitting).
              </li>
              <li>
                <strong>JAMB Subject Combinations:</strong> Check that your 4 UTME subjects strictly mirror the required subjects for this institution.
              </li>
              <li>
                <strong>Post-UTME Weighting:</strong> Many federal universities compute a 50:30:20 or 50:50 aggregate (50% JAMB, 30% Post-UTME CBT, 20% O&apos;Level).
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
