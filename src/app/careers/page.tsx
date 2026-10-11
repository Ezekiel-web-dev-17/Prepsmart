"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CAREERS_DATA, CAREER_FACULTIES, type Career } from "@/data/careers";

export default function CareersPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<string>("All Disciplines");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [activeCareerModal, setActiveCareerModal] = useState<Career | null>(null);

  // Common high school subjects candidates may excel in
  const highSchoolSubjects = [
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Literature in English",
    "Government",
    "Economics",
  ];

  const filteredCareers = useMemo(() => {
    return CAREERS_DATA.filter((career) => {
      // Faculty filter
      const matchesFaculty =
        selectedFaculty === "All Disciplines" || career.faculty === selectedFaculty;

      // Search query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        career.title.toLowerCase().includes(query) ||
        career.degree.toLowerCase().includes(query) ||
        career.summary.toLowerCase().includes(query) ||
        career.jambSubjects.some((s) => s.toLowerCase().includes(query)) ||
        career.careerRoles.some((r) => r.toLowerCase().includes(query));

      // Subject strength filter
      const matchesSubject =
        selectedSubjectFilter === "all" ||
        career.excelSubjects.some((s) =>
          s.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase())
        ) ||
        career.jambSubjects.some((s) =>
          s.toLowerCase().includes(selectedSubjectFilter.toLowerCase())
        );

      return matchesFaculty && matchesSearch && matchesSubject;
    });
  }, [selectedFaculty, searchQuery, selectedSubjectFilter]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Career & Dream Course Guide • Nigeria UTME
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Learn What Courses to Excel In For Your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300">
              Dream Career
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Gain complete clarity on official JAMB UTME subject combinations, compulsory WAEC/NECO
            prerequisites, and secondary school courses where distinction grades (A1/B2) are required
            to secure university admission in Nigeria.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Authentic JAMB Brochure Combinations</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Core Subjects to Excel In</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Competitive Target Cut-Offs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Strength Matcher Card */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              What School Subject Are You Best At?
            </h2>
            <p className="text-xs text-muted-foreground">
              Filter careers that demand excellence in your strongest secondary school subjects:
            </p>
          </div>
          {selectedSubjectFilter !== "all" && (
            <button
              onClick={() => setSelectedSubjectFilter("all")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold self-start sm:self-auto"
            >
              Reset Subject Filter
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedSubjectFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedSubjectFilter === "all"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            All Strengths
          </button>
          {highSchoolSubjects.map((sub) => {
            const isActive = selectedSubjectFilter.toLowerCase() === sub.toLowerCase();
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubjectFilter(isActive ? "all" : sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </section>

      {/* Search & Discipline Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              id="career-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, degree (e.g. MBBS, LL.B), or roles (e.g. Surgeon, Software)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Faculty Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CAREER_FACULTIES.map((faculty) => {
            const isSelected = selectedFaculty === faculty;
            return (
              <button
                key={faculty}
                onClick={() => setSelectedFaculty(faculty)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {faculty}
              </button>
            );
          })}
        </div>
      </section>

      {/* Careers Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-foreground">
            Featured Career Pathways ({filteredCareers.length})
          </h2>
          <span className="text-xs text-muted-foreground">
            Showing official JAMB & WAEC requirements
          </span>
        </div>

        {filteredCareers.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-8 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-foreground">No careers match your search</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search terms, clearing the subject filter, or selecting &quot;All Disciplines&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedFaculty("All Disciplines");
                setSelectedSubjectFilter("all");
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCareers.map((career) => (
              <div
                key={career.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Bar with Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${career.badgeColor}`}
                        >
                          {career.faculty}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                          {career.degree}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground pt-1">
                        {career.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Competitive UTME
                      </span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 px-2 py-0.5 rounded-md inline-block">
                        {career.competitiveJambScore}
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {career.summary}
                  </p>

                  {/* Subjects to Excel In */}
                  <div className="bg-muted/50 border border-border rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Subjects Where You Must Excel
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-semibold">
                        A1 / B2 Target
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {career.excelSubjects.map((item) => (
                        <div
                          key={item.subject}
                          className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-card border border-border/80 px-2.5 py-1.5 rounded-lg"
                        >
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {item.subject}
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {item.targetGrade}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* JAMB Combination */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      JAMB UTME Subject Combination:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.jambSubjects.map((subject, idx) => (
                        <span
                          key={subject}
                          className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                            idx === 0
                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/60"
                              : "bg-card text-foreground border-border"
                          }`}
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-border flex items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Outlook: <strong className="text-foreground">{career.jobOutlook} Demand</strong>
                  </span>
                  <button
                    onClick={() => setActiveCareerModal(career)}
                    className="px-3 py-1.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    View Details & Top Universities →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Advisory Callout: WAEC & JAMB Golden Rules */}
      <section className="bg-card border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            💡
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">
              Examiner Insider: Avoiding Common Admission Traps
            </h3>
            <p className="text-xs text-muted-foreground">
              Essential rules from the official JAMB brochure to protect your eligibility:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
          <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-1.5">
            <h4 className="font-bold text-foreground">1. One vs. Two Sittings</h4>
            <p className="leading-relaxed">
              Competitive medical, law, and engineering faculties at top federal universities (UNILAG, UI)
              strictly favor single-sitting WAEC/NECO results during point screening.
            </p>
          </div>
          <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-1.5">
            <h4 className="font-bold text-foreground">2. Mathematics Requirement</h4>
            <p className="leading-relaxed">
              Even for Arts and Social Science disciplines (like Law, Mass Comm, and Political Science), a
              minimum Credit pass (C6) in Mathematics is now mandatory across virtually all universities.
            </p>
          </div>
          <div className="bg-muted/40 p-4 rounded-xl border border-border space-y-1.5">
            <h4 className="font-bold text-foreground">3. Catchment & Merit Quota</h4>
            <p className="leading-relaxed">
              Federal universities allocate 45% of seats to national merit (highest score regardless of state),
              35% to catchment areas, and 20% to Educationally Less Developed States (ELDS).
            </p>
          </div>
        </div>
      </section>

      {/* Modal for In-depth Details */}
      {activeCareerModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveCareerModal(null)}
        >
          <div
            className="bg-card border border-border rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full border bg-muted text-muted-foreground">
                  {activeCareerModal.faculty}
                </span>
                <h3 className="text-2xl font-black text-foreground pt-1">
                  {activeCareerModal.title} ({activeCareerModal.degree})
                </h3>
              </div>
              <button
                onClick={() => setActiveCareerModal(null)}
                className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-muted/80 text-sm font-bold"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeCareerModal.summary}
            </p>

            {/* Why You Must Excel in Specific Subjects */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">
                Why Mastery In These Subjects Is Crucial:
              </h4>
              <div className="space-y-2">
                {activeCareerModal.excelSubjects.map((item) => (
                  <div
                    key={item.subject}
                    className="bg-muted/40 border border-border rounded-xl p-3 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-sm">
                        {item.subject}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        {item.targetGrade}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.importance}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* O'Level Requirement */}
            <div className="bg-card border border-border p-4 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-foreground block">
                O&apos;Level (WAEC / NECO / GCE) SSCE Prerequisites:
              </span>
              <p className="text-muted-foreground leading-relaxed">
                {activeCareerModal.waecRequirements}
              </p>
            </div>

            {/* Top Nigerian Universities */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">
                  Top Recommended Universities in Nigeria:
                </h4>
                <Link
                  href="/universities"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Explore Cut-Off Marks →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-muted/40 p-3 rounded-xl border border-border space-y-1">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 text-[10px] uppercase">
                    Federal
                  </span>
                  <ul className="space-y-1 text-foreground font-medium">
                    {activeCareerModal.topInstitutions.federal.map((uni) => (
                      <li key={uni}>• {uni}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border space-y-1">
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 text-[10px] uppercase">
                    State
                  </span>
                  <ul className="space-y-1 text-foreground font-medium">
                    {activeCareerModal.topInstitutions.state.map((uni) => (
                      <li key={uni}>• {uni}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/40 p-3 rounded-xl border border-border space-y-1">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-[10px] uppercase">
                    Private
                  </span>
                  <ul className="space-y-1 text-foreground font-medium">
                    {activeCareerModal.topInstitutions.private.map((uni) => (
                      <li key={uni}>• {uni}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Insider Tip */}
            <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <strong className="block font-bold">Admissions Insider Tip:</strong>
              <p className="leading-relaxed">{activeCareerModal.insiderTip}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveCareerModal(null)}
                className="px-5 py-2 rounded-xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 transition-colors"
              >
                Close
              </button>
              <Link
                href="/universities"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Check University Cut-Offs
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
