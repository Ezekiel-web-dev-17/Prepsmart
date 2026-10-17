"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ALL_SYLLABUS_TOPICS,
  ACADEMIC_STREAMS,
  FOUR_WEEK_CURRICULUM,
  EXAMINER_TRAPS,
  EXAM_TIMING_STRATEGY,
  NormalizedTopic,
} from "./study-data";

export default function StudyCurriculumHub() {
  // Navigation / active section state
  const [activeTab, setActiveTab] = useState<
    "streams" | "roadmap" | "syllabus" | "blueprint" | "traps"
  >("streams");

  // Roadmap week selector
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Roadmap interactive checklist stored in localStorage
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  // Syllabus Explorer state
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>({});

  // Active Examiner trap selection
  const [selectedTrapId, setSelectedTrapId] = useState<string>(EXAMINER_TRAPS[0].id);

  // Load saved milestones and mastered topics from localStorage
  useEffect(() => {
    try {
      const savedMilestones = localStorage.getItem("prepsmart_milestones");
      if (savedMilestones) {
        setCompletedMilestones(JSON.parse(savedMilestones));
      }
      const savedMastered = localStorage.getItem("prepsmart_mastered_topics");
      if (savedMastered) {
        setMasteredTopics(JSON.parse(savedMastered));
      }
    } catch {
      // Ignore localStorage errors in SSR or private browsing
    }
  }, []);

  const toggleMilestone = (key: string) => {
    setCompletedMilestones((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("prepsmart_milestones", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const toggleMasteredTopic = (id: string) => {
    setMasteredTopics((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("prepsmart_mastered_topics", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Filter syllabus topics
  const filteredTopics = useMemo(() => {
    return ALL_SYLLABUS_TOPICS.filter((topic) => {
      // Filter by subject
      if (selectedSubject !== "all" && topic.subjectId !== selectedSubject) {
        return false;
      }
      // Filter by query
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = topic.title.toLowerCase().includes(q);
      const inSection = topic.section?.toLowerCase().includes(q) ?? false;
      const inContents = topic.contents.some((c) => c.toLowerCase().includes(q));
      const inObjectives = topic.objectives.some((o) => o.toLowerCase().includes(q));

      return inTitle || inSection || inContents || inObjectives;
    });
  }, [selectedSubject, searchQuery]);

  const currentWeekPlan = useMemo(() => {
    return FOUR_WEEK_CURRICULUM.find((w) => w.week === selectedWeek) || FOUR_WEEK_CURRICULUM[0];
  }, [selectedWeek]);

  const activeTrap = useMemo(() => {
    return EXAMINER_TRAPS.find((t) => t.id === selectedTrapId) || EXAMINER_TRAPS[0];
  }, [selectedTrapId]);

  // Subject pill list for filters
  const subjectFilters = [
    { id: "all", label: "All Subjects", count: ALL_SYLLABUS_TOPICS.length },
    { id: "use-of-english", label: "Use of English", count: 3 },
    { id: "mathematics", label: "Mathematics", count: 23 },
    { id: "physics", label: "Physics", count: 40 },
    { id: "chemistry", label: "Chemistry", count: 18 },
    { id: "biology", label: "Biology", count: 24 },
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* ================= HERO HEADER ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-card via-card to-blue-50/40 dark:to-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 p-6 sm:p-10 shadow-sm transition-all duration-200">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-teal-500/10 dark:bg-teal-400/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          {/* Badge & Meta */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-xs shadow-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Official 2026 JAMB Blueprint
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-card/80 backdrop-blur-xs border border-border text-muted-foreground shadow-2xs">
              4-Week Structured Sprints
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-card/80 backdrop-blur-xs border border-border text-emerald-600 dark:text-emerald-400 shadow-2xs">
              🎯 300+ Target Score Framework
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
              4-Week Master Curriculum &amp; Syllabus Hub
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl leading-relaxed">
              Explore official syllabuses, structured 4-week milestones, and examiner trap warnings across{" "}
              <strong className="text-foreground font-semibold">Science</strong>,{" "}
              <strong className="text-foreground font-semibold">Commercial</strong>, and{" "}
              <strong className="text-foreground font-semibold">Arts</strong> streams.
            </p>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-card/70 backdrop-blur-xs border border-border rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground block">Academic Streams</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">3 Pathways</span>
              <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold block mt-0.5">
                STEM • Business • Arts
              </span>
            </div>

            <div className="bg-card/70 backdrop-blur-xs border border-border rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground block">Syllabus Topics</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">108 Topics</span>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold block mt-0.5">
                Fully Mapped Objectives
              </span>
            </div>

            <div className="bg-card/70 backdrop-blur-xs border border-border rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground block">Exam Pacing</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">180 Qs / 120m</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold block mt-0.5">
                40s / Question Target
              </span>
            </div>

            <div className="bg-card/70 backdrop-blur-xs border border-border rounded-2xl p-3.5 shadow-2xs">
              <span className="text-xs font-medium text-muted-foreground block">Curriculum Pace</span>
              <span className="text-xl sm:text-2xl font-black text-foreground">4 Weeks</span>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold block mt-0.5">
                Foundation to Simulation
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActiveTab("streams")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "streams"
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                  : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
            >
              Academic Streams
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("roadmap")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "roadmap"
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                  : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
            >
              4-Week Milestone Roadmap
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("syllabus")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "syllabus"
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                  : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
            >
              Live Syllabus Explorer ({ALL_SYLLABUS_TOPICS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("blueprint")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "blueprint"
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                  : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
            >
              120m Exam Blueprint
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("traps")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "traps"
                  ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                  : "bg-card border border-border text-foreground hover:bg-muted"
                }`}
            >
              Examiner Traps Alert
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: ACADEMIC STREAMS ================= */}
      {activeTab === "streams" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>Core Academic Streams</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Select Your Degree Pathway
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:max-w-md">
              Each stream features a tailored 4-week syllabus timeline, specific faculty requirements, and daily study allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {ACADEMIC_STREAMS.map((stream) => (
              <div
                key={stream.id}
                className={`bg-card rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all duration-300 hover:shadow-md ${stream.accentBorder} ${stream.accentBg}`}
              >
                <div className="space-y-5">
                  {/* Top Badge & Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${stream.accentBadge}`}
                    >
                      {stream.badge}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-card border border-border text-foreground shadow-2xs">
                      {stream.targetScore}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                      {stream.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {stream.tagline}
                    </p>
                  </div>

                  {/* Daily Study Time Pill */}
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-card border border-border text-muted-foreground">
                    <span>⏱ Recommended Pace:</span>
                    <span className="text-foreground font-bold">{stream.studyTime}</span>
                  </div>

                  {/* Core Subjects */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Core Registered Subjects (UTME Combos):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {stream.subjects.map((sub) => (
                        <span
                          key={sub.code}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border text-foreground shadow-2xs"
                        >
                          <span className="font-bold text-[10px] text-muted-foreground">
                            {sub.code}
                          </span>
                          <span>{sub.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            ({sub.questionsCount}Q)
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Target Faculties */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Target Faculties:
                    </span>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {stream.faculties.slice(0, 3).map((fac, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                          <span>{fac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Actions */}
                <div className="pt-6 space-y-2.5 border-t border-border/70 mt-6">
                  <Link
                    href={stream.href}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs shadow-xs shadow-blue-500/20 transition-all text-center"
                  >
                    <span>View {stream.title} Curriculum</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("syllabus");
                      if (stream.id === "science") setSelectedSubject("physics");
                      if (stream.id === "commercial") setSelectedSubject("mathematics");
                      if (stream.id === "arts") setSelectedSubject("use-of-english");
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    Quick Syllabus Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SECTION 2: 4-WEEK ROADMAP ================= */}
      {activeTab === "roadmap" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>Milestone Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                The 4-Week High-Yield Sprint
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:max-w-md">
              A systematic progression from core formulas to full timed CBT simulation mocks.
            </p>
          </div>

          {/* Week Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1.5 bg-card border border-border rounded-2xl shadow-2xs">
            {FOUR_WEEK_CURRICULUM.map((plan) => {
              const isActive = selectedWeek === plan.week;
              return (
                <button
                  key={plan.week}
                  type="button"
                  onClick={() => setSelectedWeek(plan.week)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer flex flex-col justify-between ${isActive
                      ? "bg-blue-600 dark:bg-blue-500 text-white shadow-xs shadow-blue-500/30"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground border border-border"
                        }`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-xs font-bold">Week {plan.week}</span>
                  </div>
                  <span className="text-xs font-bold mt-2 truncate block">
                    {plan.phase.replace(`Phase ${plan.week}: `, "")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Week Detailed Plan */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Header of Week */}
            <div className="space-y-2 border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {currentWeekPlan.phase}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Target: {currentWeekPlan.target}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {currentWeekPlan.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentWeekPlan.tagline}
              </p>
            </div>

            {/* Core Focus & Daily Routine Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Schedule Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span>⏱ Daily 2.5-Hour Breakdown (Week {selectedWeek}):</span>
                </h4>
                <div className="space-y-2.5">
                  {currentWeekPlan.dailyRoutine.map((block, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-muted/50 border border-border"
                    >
                      <span className="px-2.5 py-1 rounded-lg bg-card border border-border text-[11px] font-black text-blue-600 dark:text-blue-400 shrink-0">
                        {block.time}
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                          {block.activity}
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          {block.purpose}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Milestone Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    🎯 Interactive Deliverables Checklist:
                  </h4>
                  <span className="text-[11px] text-muted-foreground">
                    Click to check off
                  </span>
                </div>

                <div className="space-y-2">
                  {currentWeekPlan.milestones.map((milestone, idx) => {
                    const key = `w${selectedWeek}_m${idx}`;
                    const isChecked = Boolean(completedMilestones[key]);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleMilestone(key)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${isChecked
                            ? "bg-emerald-500/8 dark:bg-emerald-950/20 border-emerald-500/40 text-foreground"
                            : "bg-card border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-muted-foreground/40 bg-card"
                            }`}
                        >
                          {isChecked && (
                            <svg
                              className="w-3.5 h-3.5"
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
                        <span
                          className={`text-xs leading-relaxed ${isChecked ? "line-through opacity-80" : "font-medium"
                            }`}
                        >
                          {milestone}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* High-Yield Examiner Tip for the Week */}
            <div className="p-4 rounded-2xl bg-amber-500/8 dark:bg-amber-950/20 border border-amber-500/30 space-y-1.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <span>💡 High-Yield Examiner Insights for Week {selectedWeek}:</span>
              </span>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4 list-disc">
                {currentWeekPlan.highYieldTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ================= SECTION 3: LIVE SYLLABUS EXPLORER ================= */}
      {activeTab === "syllabus" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>Official JAMB Syllabuses</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Live Syllabus &amp; Topic Explorer
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:max-w-md">
              Search topics, view specific learning objectives, and test your knowledge directly.
            </p>
          </div>

          {/* Search Bar & Subject Filters */}
          <div className="bg-card border border-border rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 108 topics (e.g. 'Calculus', 'Organic', 'Optics', 'Stress', 'Genetics')..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-muted/60 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <svg
                className="w-5 h-5 absolute left-3.5 top-3.5 text-muted-foreground"
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
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-3.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-muted"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {subjectFilters.map((sub) => {
                const isSelected = selectedSubject === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubject(sub.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isSelected
                        ? "bg-blue-600 dark:bg-blue-500 text-white shadow-xs shadow-blue-500/20"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                      }`}
                  >
                    <span>{sub.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected
                          ? "bg-white/25 text-white"
                          : "bg-card text-muted-foreground border border-border"
                        }`}
                    >
                      {sub.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Results Count Header */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
              <span>
                Showing <strong className="text-foreground">{filteredTopics.length}</strong> of{" "}
                {ALL_SYLLABUS_TOPICS.length} topics
                {searchQuery && ` matching "${searchQuery}"`}
              </span>
              <span className="text-[11px]">
                {Object.values(masteredTopics).filter(Boolean).length} Mastered
              </span>
            </div>
          </div>

          {/* Topics List Grid */}
          <div className="space-y-3">
            {filteredTopics.length === 0 ? (
              <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-3">
                <span className="text-3xl">🔍</span>
                <h3 className="text-lg font-bold text-foreground">No syllabus topics found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No topics matched your search for &quot;{searchQuery}&quot;. Try searching for general terms like
                  &quot;mechanics&quot;, &quot;algebra&quot;, &quot;acids&quot;, or &quot;plants&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSubject("all");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs cursor-pointer"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                const isMastered = Boolean(masteredTopics[topic.id]);

                return (
                  <div
                    key={topic.id}
                    className={`bg-card rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded
                        ? "border-blue-500/40 shadow-xs ring-1 ring-blue-500/20"
                        : "border-border hover:border-border/90 hover:shadow-2xs"
                      }`}
                  >
                    {/* Header Row */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            {topic.subjectName} ({topic.subjectCode})
                          </span>
                          <span className="text-[11px] font-semibold text-muted-foreground">
                            Topic #{topic.topicNumber}
                          </span>
                          {topic.section && (
                            <span className="text-[10px] text-muted-foreground/80 truncate max-w-xs">
                              • {topic.section}
                            </span>
                          )}
                          {isMastered && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ✓ Mastered
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-foreground truncate">
                          {topic.title}
                        </h3>

                        {/* Contents Snippet */}
                        {topic.contents.length > 0 && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {topic.contents.join(" • ")}
                          </p>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleMasteredTopic(topic.id)}
                          title={isMastered ? "Mark as needing review" : "Mark as mastered"}
                          className={`p-2 rounded-xl text-xs border transition-colors cursor-pointer ${isMastered
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted border-border text-muted-foreground hover:text-foreground"
                            }`}
                        >
                          {isMastered ? "★ Mastered" : "☆ Mark Mastered"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTopicId(isExpanded ? null : topic.id)
                          }
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground border border-border transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{isExpanded ? "Hide Objectives" : "View Objectives"}</span>
                          <span className="text-[10px]">
                            ({topic.objectives.length})
                          </span>
                        </button>

                        <Link
                          href={`/quiz/${topic.subjectId}?topic=${encodeURIComponent(topic.title)}`}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]"
                          title={`Start CBT Drill for ${topic.title}`}
                        >
                          <span>CBT Drill</span>
                          <span aria-hidden="true">⚡</span>
                        </Link>
                      </div>
                    </div>

                    {/* Expandable Objectives & Contents Details */}
                    {isExpanded && (
                      <div className="border-t border-border/80 bg-muted/30 p-5 space-y-4">
                        {/* Objectives List */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                            <span>🎯 Official JAMB Learning Objectives (Candidates should be able to):</span>
                          </span>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                            {topic.objectives.map((obj, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 p-2.5 rounded-xl bg-card border border-border"
                              >
                                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">
                                  ✓
                                </span>
                                <span className="leading-relaxed">{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contents List */}
                        {topic.contents.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                              📚 Detailed Syllabus Content:
                            </span>
                            <div className="p-3 rounded-xl bg-card border border-border space-y-1">
                              {topic.contents.map((item, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground leading-relaxed">
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Launch Action */}
                        <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs text-muted-foreground">
                            Ready to test your comprehension on this topic?
                          </p>
                          <Link
                            href={`/quiz/${topic.subjectId}?topic=${encodeURIComponent(topic.title)}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <span>Launch CBT Drill for {topic.title}</span>
                            <span aria-hidden="true">⚡</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ================= SECTION 4: 120-MINUTE BLUEPRINT ================= */}
      {activeTab === "blueprint" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>CBT Exam Time Budgeting</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                The 180-Question / 120-Minute Blueprint
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:max-w-md">
              Master the exact pacing required to complete all 4 subjects and review flagged questions.
            </p>
          </div>

          {/* Visual Pacing Distribution Bar */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Total Exam Duration: 120 Minutes (2 Hours)
              </span>
              <div className="w-full h-8 rounded-xl bg-muted overflow-hidden flex shadow-inner">
                <div
                  style={{ width: "29.1%" }}
                  className="bg-blue-600 flex items-center justify-center text-[11px] font-bold text-white px-2 truncate"
                  title="English: 35 Minutes"
                >
                  ENG (35m)
                </div>
                <div
                  style={{ width: "20.8%" }}
                  className="bg-teal-600 flex items-center justify-center text-[11px] font-bold text-white px-2 truncate"
                  title="Core 1: 25 Minutes"
                >
                  Core 1 (25m)
                </div>
                <div
                  style={{ width: "20.8%" }}
                  className="bg-amber-600 flex items-center justify-center text-[11px] font-bold text-white px-2 truncate"
                  title="Core 2: 25 Minutes"
                >
                  Core 2 (25m)
                </div>
                <div
                  style={{ width: "20.8%" }}
                  className="bg-purple-600 flex items-center justify-center text-[11px] font-bold text-white px-2 truncate"
                  title="Core 3: 25 Minutes"
                >
                  Core 3 (25m)
                </div>
                <div
                  style={{ width: "8.5%" }}
                  className="bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white px-1 truncate"
                  title="Review Buffer: 10 Minutes"
                >
                  Buffer (10m)
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Start (00:00)</span>
                <span>English Complete (35:00)</span>
                <span>Halfway (60:00)</span>
                <span>All 180 Attempted (110:00)</span>
                <span>Final Buffer Submit (120:00)</span>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Subject / Stage</th>
                    <th className="pb-3">Questions</th>
                    <th className="pb-3">Allocated Time</th>
                    <th className="pb-3">Speed Target</th>
                    <th className="pb-3">Examiner Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {EXAM_TIMING_STRATEGY.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5 font-bold text-foreground">{item.subject}</td>
                      <td className="py-3.5 text-muted-foreground">{item.questions} Qs</td>
                      <td className="py-3.5 font-extrabold text-blue-600 dark:text-blue-400">
                        {item.timeMinutes} Minutes
                      </td>
                      <td className="py-3.5 text-muted-foreground">
                        {item.secondsPerQ > 0 ? `~${item.secondsPerQ}s / Q` : "Review"}
                      </td>
                      <td className="py-3.5 text-muted-foreground">{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Critical Pacing Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Rule 1: The 60-Second Cutoff
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  If any calculation takes longer than 60 seconds, choose your best guess, click &apos;Flag&apos;, and move
                  forward immediately. Never sacrifice 3 other questions for 1 point.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Rule 2: Zero Blank Policy
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  JAMB does not penalize incorrect guesses. Leaving blank spaces is giving away probability. Ensure all
                  180 bubbles are answered before final submission.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-muted/60 border border-border space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Rule 3: Start with English
                </span>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Completing English in 35 minutes gives you mental clarity and banks 60 questions quickly, leaving
                  maximum bandwidth for intensive calculation subjects.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= SECTION 5: EXAMINER TRAPS ================= */}
      {activeTab === "traps" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                <span>High-Frequency Pitfalls</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Examiner Trap Alert Watch
              </h2>
            </div>
            <p className="text-sm text-muted-foreground sm:max-w-md">
              Learn the 4 psychological and mathematical traps examiners use to trick top candidates.
            </p>
          </div>

          {/* Trap selector cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXAMINER_TRAPS.map((trap) => {
              const isSelected = selectedTrapId === trap.id;
              return (
                <button
                  key={trap.id}
                  type="button"
                  onClick={() => setSelectedTrapId(trap.id)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                      ? "bg-card border-rose-500 shadow-xs ring-1 ring-rose-500/30"
                      : "bg-card border-border hover:border-border/90"
                    }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {trap.severity}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{trap.subject}</span>
                    </div>
                    <h3 className="text-xs font-extrabold text-foreground leading-snug">
                      {trap.title}
                    </h3>
                  </div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-3 block">
                    {isSelected ? "Active Review" : "View Breakdown →"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Trap Detailed Breakdown */}
          <div className="bg-card border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 border-b border-border pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
                  {activeTrap.trapType}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  Affected Subjects: {activeTrap.subject}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                {activeTrap.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Examiner Technique */}
              <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <span>⚠️ How The Examiner Sets The Trap:</span>
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeTrap.examinerTechnique}
                </p>
              </div>

              {/* Student Counter-Tactic */}
              <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>🛡️ Your Winning Counter-Strategy:</span>
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeTrap.studentSolution}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Link
                href="/revision"
                className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-xs font-bold text-foreground transition-colors"
              >
                Go to Revision Hub &amp; Flashcards →
              </Link>
              <Link
                href="/quiz/physics"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-2xs transition-all"
              >
                Test With Trap Questions in CBT Drill
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= SECTION 6: DAILY STUDY TIMETABLE CTA ================= */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
              Ready to Execute Your 4-Week Study Plan?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sync your schedule with the interactive class roster and verify readiness with the diagnostic pre-test.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all"
            >
              Take Pre-Test Evaluation
            </Link>
            <Link
              href="/roster"
              className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-colors"
            >
              View Class Timetable
            </Link>
            <Link
              href="/progress"
              className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-colors"
            >
              My Readiness Analytics
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
