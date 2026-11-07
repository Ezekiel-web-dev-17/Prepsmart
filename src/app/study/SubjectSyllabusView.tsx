"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SubjectCurriculum,
  STREAM_SUBJECTS_MAP,
  normalizeSubjectSlug,
  normalizeStreamSlug,
} from "./curriculum-data";
import {
  convertCurriculumToRoadmap,
  RoadmapTopicNode,
  SubjectRoadmap,
} from "@/lib/roadmap-curriculum";
import TopicMasteryDrawer, {
  TopicProgressState,
} from "@/components/study/TopicMasteryDrawer";
import {
  ZapIcon,
  BookOpenIcon,
  TargetIcon,
  FlameIcon,
  CheckIcon,
  CheckCircleIcon,
  SearchIcon,
  XIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
} from "@/components/ui/icons";

interface SubjectSyllabusViewProps {
  curriculum: SubjectCurriculum;
  currentStream: "science" | "commercial" | "arts";
  currentSubject: string;
  onSwitchToMockExam?: () => void;
  onSwitchToCurriculumOverview?: () => void;
}

export default function SubjectSyllabusView({
  curriculum,
  currentStream,
  currentSubject,
  onSwitchToMockExam,
  onSwitchToCurriculumOverview,
}: SubjectSyllabusViewProps) {
  const router = useRouter();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [filterMastery, setFilterMastery] = useState<"all" | "mastered" | "pending">("all");
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [showExamDetails, setShowExamDetails] = useState<boolean>(false);

  // Mastered topics stored in localStorage (synced with prepsmart_mastered_topics)
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("prepsmart_mastered_topics");
      if (saved) {
        setMasteredTopics(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const toggleMastery = (topicId: string) => {
    setMasteredTopics((prev) => {
      const updated = { ...prev, [topicId]: !prev[topicId] };
      try {
        localStorage.setItem("prepsmart_mastered_topics", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const toggleExpand = (topicNumber: number) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicNumber]: !prev[topicNumber],
    }));
  };

  // View mode switcher: 🗺️ Interactive Syllabus Flowchart (default) vs 📋 Document Outline
  const [viewMode, setViewMode] = useState<"flowchart" | "outline">("flowchart");

  // Dynamic zoom for flowchart canvas
  const [zoomScale, setZoomScale] = useState<number>(1);

  // Selected topic for mastery drawer
  const [selectedTopic, setSelectedTopic] = useState<RoadmapTopicNode | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Topic progress from database API
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgressState>>({});
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

  // Convert official curriculum directly into unified interactive syllabus flowchart
  const roadmap = useMemo(() => convertCurriculumToRoadmap(curriculum), [curriculum]);

  // Fetch real recorded progress from database
  useEffect(() => {
    fetchTopicProgress(curriculum.id);
  }, [curriculum.id]);

  const fetchTopicProgress = async (subjectId: string) => {
    setIsLoadingProgress(true);
    try {
      const res = await fetch(`/api/study/topic-progress?subject=${encodeURIComponent(subjectId)}`);
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, TopicProgressState> = {};
        if (data.progress && Array.isArray(data.progress)) {
          data.progress.forEach((p: TopicProgressState) => {
            map[p.topicSlug] = p;
          });
        }
        setProgressMap(map);
      }
    } catch (err) {
      console.error("Error fetching topic progress:", err);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  const handleOpenTopic = (topic: RoadmapTopicNode) => {
    setSelectedTopic(topic);
    setIsDrawerOpen(true);
  };

  const handleTopicCompleted = (topicSlug: string) => {
    setProgressMap((prev) => ({
      ...prev,
      [topicSlug]: {
        ...(prev[topicSlug] || {
          subject: curriculum.id,
          stream: currentStream,
          topicSlug,
          topicTitle: selectedTopic?.title || topicSlug,
        }),
        isCompleted: true,
        completedAt: new Date().toISOString(),
      },
    }));

    // Also sync localStorage masteredTopics for offline and instant responsiveness
    setMasteredTopics((prev) => {
      const updated = { ...prev, [topicSlug]: true };
      try {
        localStorage.setItem("prepsmart_mastered_topics", JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  // Helper to open topic by curriculum topic number from outline view
  const handleOpenCurriculumTopic = (topicNumber: number) => {
    const topicNode = roadmap.stages
      .flatMap((s) => s.topics)
      .find((t) => t.order === topicNumber || t.id === `${curriculum.id}-t${topicNumber}`);
    if (topicNode) {
      handleOpenTopic(topicNode);
    }
  };

  // Flatten all topics for searching and calculations
  const allTopics = useMemo(() => {
    return curriculum.sections.flatMap((sec) => sec.topics);
  }, [curriculum]);

  // Mastered count for this subject
  const masteredCount = useMemo(() => {
    return allTopics.filter((t) => {
      const key = `${curriculum.id}-t${t.topicNumber}`;
      return !!masteredTopics[key];
    }).length;
  }, [allTopics, curriculum.id, masteredTopics]);

  const masteryPercent = allTopics.length > 0 ? Math.round((masteredCount / allTopics.length) * 100) : 0;

  // Filter sections and topics
  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return curriculum.sections
      .map((sec) => {
        if (selectedSection !== "all" && sec.sectionTitle !== selectedSection) {
          return null;
        }

        const filteredTopics = sec.topics.filter((t) => {
          const key = `${curriculum.id}-t${t.topicNumber}`;
          const isMastered = !!masteredTopics[key];

          if (filterMastery === "mastered" && !isMastered) return false;
          if (filterMastery === "pending" && isMastered) return false;

          if (!q) return true;

          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesContents = t.contents.some((c) => c.toLowerCase().includes(q));
          const matchesObjectives = t.objectives.some((o) => o.toLowerCase().includes(q));
          return matchesTitle || matchesContents || matchesObjectives;
        });

        if (filteredTopics.length === 0) return null;

        return {
          ...sec,
          topics: filteredTopics,
        };
      })
      .filter(Boolean) as typeof curriculum.sections;
  }, [curriculum, selectedSection, filterMastery, searchQuery, masteredTopics]);

  // Handle switching subjects or streams
  const handleSelectSubject = (subjId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("stream", currentStream);
    url.searchParams.set("subject", subjId);
    url.searchParams.delete("tab");
    router.push(url.toString());
  };

  const handleSelectStream = (newStream: "science" | "commercial" | "arts") => {
    const streamSubjects = STREAM_SUBJECTS_MAP[newStream];
    // Keep current subject if in new stream, otherwise default to first
    const hasCurrent = streamSubjects.some((s) => s.id === currentSubject);
    const targetSubject = hasCurrent ? currentSubject : streamSubjects[0].id;

    const url = new URL(window.location.href);
    url.searchParams.set("stream", newStream);
    url.searchParams.set("subject", targetSubject);
    url.searchParams.delete("tab");
    router.push(url.toString());
  };

  const streamSubjects = STREAM_SUBJECTS_MAP[currentStream] || STREAM_SUBJECTS_MAP.science;

  return (
    <div className="space-y-8 pb-16 animate-fadeIn max-w-full min-w-0 overflow-x-hidden">
      {/* ── 1. BREADCRUMBS & TOP NAV ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground border-b border-border pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/dashboard" className="hover:text-foreground transition-colors font-medium">
            Dashboard
          </Link>
          <span>/</span>
          {onSwitchToCurriculumOverview ? (
            <button
              type="button"
              onClick={onSwitchToCurriculumOverview}
              className="hover:text-foreground transition-colors font-medium cursor-pointer"
            >
              Study Hub
            </button>
          ) : (
            <span className="font-medium text-foreground">
              Study Hub
            </span>
          )}
          <span>/</span>
          <span className="capitalize font-bold text-foreground">
            {curriculum.streamName}
          </span>
          <span>/</span>
          <span className="font-extrabold text-blue-600 dark:text-blue-400">
            {curriculum.subjectName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToMockExam ? (
            <button
              type="button"
              onClick={onSwitchToMockExam}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ZapIcon className="w-3.5 h-3.5" />
              <span>Take Full CBT Mock Exam</span>
            </button>
          ) : (
            <Link
              href="/study?tab=mock-exam"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5"
            >
              <ZapIcon className="w-3.5 h-3.5" />
              <span>Take Full CBT Mock Exam</span>
            </Link>
          )}
        </div>
      </div>

      {/* ── 2. SUBJECT HERO BANNER ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-10 shadow-lg shadow-blue-500/10 space-y-6">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
              {curriculum.streamBadge}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-100 text-xs font-bold">
              JAMB UTME 2026 Official Syllabus
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
              <CheckCircleIcon className="w-3.5 h-3.5" />
              <span>Verified Curriculum</span>
            </span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {curriculum.subjectName} ({curriculum.subjectCode})
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
              {curriculum.overview}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-3xl">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black block tabular-nums">
                {curriculum.totalQuestions}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                Exam Questions
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black block tabular-nums">
                {allTopics.length}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                Syllabus Topics
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black block tabular-nums">
                {curriculum.durationMinutes}m
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                Allocated Time
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center">
              <span className="text-xl sm:text-2xl font-black block tabular-nums text-emerald-300">
                {curriculum.targetAccuracy}
              </span>
              <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                Target Benchmark
              </span>
            </div>
          </div>
        </div>

        {/* Subtle background flair */}
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </section>

      {/* ── 3. STREAM & SUBJECT SWITCHER BARS ── */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Stream Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Department Stream:
            </span>
            <div className="flex items-center gap-1.5">
              {(["science", "commercial", "arts"] as const).map((str) => (
                <button
                  key={str}
                  type="button"
                  onClick={() => handleSelectStream(str)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                    currentStream === str
                      ? "bg-foreground text-background shadow-xs font-extrabold"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {str}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Switching stream shows relevant degree combinations &amp; subjects.
          </div>
        </div>

        {/* Subject Pills for Current Stream */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Subjects in {curriculum.streamName}:
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {streamSubjects.length} Core Subjects Available
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {streamSubjects.map((sub) => {
              const isSelected = sub.id === currentSubject || sub.id === curriculum.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSelectSubject(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  <span>{sub.name}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? "bg-white/20 text-white font-black"
                        : "bg-background text-muted-foreground"
                    }`}
                  >
                    {sub.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. EXAMINATION STRUCTURE & RECOMMENDED TEXTS COLLAPSIBLE ── */}
      <section className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowExamDetails(!showExamDetails)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <BookOpenIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-foreground">
                Official Examination Structure, Objectives &amp; Recommended Texts
              </h3>
              <p className="text-xs text-muted-foreground">
                Click to {showExamDetails ? "hide" : "view"} question breakdown and approved JAMB textbooks.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {showExamDetails ? "▲ Hide Details" : "▼ View Details"}
          </span>
        </button>

        {showExamDetails && (
          <div className="p-5 border-t border-border/60 space-y-6 bg-muted/10 animate-fadeIn">
            {/* General Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Official UTME General Objectives
              </h4>
              <ul className="space-y-1.5 text-xs text-foreground/90 pl-4 list-disc">
                {curriculum.generalObjectives.map((obj, i) => (
                  <li key={i} className="leading-relaxed">
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Structure Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Question Distribution by Section ({curriculum.totalQuestions} Questions Total)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {curriculum.examinationStructure.map((st, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-background border border-border space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-foreground">{st.section}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">
                        {st.questionCount} Qs
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Texts */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recommended Textbooks
              </h4>
              <div className="flex flex-wrap gap-2">
                {curriculum.recommendedTexts.map((txt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs text-foreground font-medium flex items-center gap-1.5"
                  >
                    <BookOpenIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>{txt}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 5. TOPIC MASTERY TRACKER & VIEW SWITCHER ── */}
      <section className="bg-card border border-border/80 rounded-2xl p-5 space-y-5 shadow-xs">
        {/* View Mode Switcher: 🗺️ Interactive Syllabus Flowchart (Default) vs 📋 Document Outline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setViewMode("flowchart")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "flowchart"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Interactive Syllabus Flowchart</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-white text-[9px] font-black uppercase">
                Default
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("outline")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === "outline"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpenIcon className="w-3.5 h-3.5" />
              <span>Document Outline &amp; Search</span>
            </button>
          </div>

          <span className="text-[11px] font-bold text-muted-foreground hidden sm:inline">
            {viewMode === "flowchart"
              ? "Interactive visual flowchart matching official JAMB syllabus"
              : "Traditional curriculum blueprint & search"}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <TargetIcon className="w-4 h-4 text-blue-600" />
              <span>{curriculum.subjectName} Mastery Progress</span>
            </span>
            <span className="font-extrabold text-foreground">
              {masteredCount} of {allTopics.length} Topics Mastered ({masteryPercent}%)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-muted overflow-hidden border border-border">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${masteryPercent}%` }}
            />
          </div>
        </div>

        {/* Outline Search & Filter Controls (Shown only in Outline mode) */}
        {viewMode === "outline" && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            {/* Search box */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${curriculum.subjectName} topics, concepts, or objectives...`}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Section Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              >
                <option value="all">All Sections ({curriculum.sections.length})</option>
                {curriculum.sections.map((sec, i) => (
                  <option key={i} value={sec.sectionTitle}>
                    {sec.sectionTitle.length > 35
                      ? `${sec.sectionTitle.slice(0, 35)}…`
                      : sec.sectionTitle}
                  </option>
                ))}
              </select>

              {/* Mastery Filter */}
              <div className="flex items-center gap-1 border border-border rounded-xl p-0.5 bg-muted/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setFilterMastery("all")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMastery === "all" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMastery("pending")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMastery === "pending" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMastery("mastered")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterMastery === "mastered" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  Mastered
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 6A. VIEW MODE CONTENT: INTERACTIVE SYLLABUS FLOWCHART ── */}
      {viewMode === "flowchart" && (
        <section className="space-y-8 animate-fadeIn">
          {/* Zoom and Stats Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Visual Flowchart Engine
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Click any topic node to write notes for AI review and unlock 5–15 JAMB questions.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border">
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.max(0.75, prev - 0.1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer text-sm font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="text-[11px] font-mono px-1 font-bold">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoomScale((prev) => Math.min(1.25, prev + 0.1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer text-sm font-bold"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Flowchart Stages Canvas with Dynamic Zoom (Contained Horizontal Overflow) */}
          <div className="w-full overflow-x-auto pb-6 scrollbar-thin">
            <div
              className="w-full max-w-4xl mx-auto transition-transform origin-top space-y-12 py-4"
              style={{ transform: `scale(${zoomScale})` }}
            >
            {roadmap.stages.map((stage, stageIdx) => (
              <div key={stage.stage} className="relative flex flex-col items-center">
                {/* Stage Milestone Banner */}
                <div className="w-full max-w-xl text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-2">
                    <BookOpenIcon className="w-3.5 h-3.5" />
                    <span>{stage.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{stage.description}</p>
                </div>

                {/* Topics Grid in this Stage */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                  {stage.topics.map((topic) => {
                    const topicKey = `${curriculum.id}-t${topic.order}`;
                    const isCompleted = Boolean(
                      progressMap[topic.id]?.isCompleted ||
                      masteredTopics[topic.id] ||
                      masteredTopics[topicKey]
                    );
                    const hasNote = Boolean(progressMap[topic.id]?.studentNote);

                    let cardBorder = "border-border/80 hover:border-blue-500 hover:shadow-md bg-card";
                    if (isCompleted) {
                      cardBorder = "border-emerald-500/60 bg-emerald-500/5 shadow-xs shadow-emerald-500/10 ring-1 ring-emerald-500/30";
                    }

                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleOpenTopic(topic)}
                        className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between group cursor-pointer ${cardBorder}`}
                      >
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground">
                              Topic {topic.order}
                            </span>
                            {topic.highYield && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                <FlameIcon className="w-3 h-3" />
                                <span>High Yield</span>
                              </span>
                            )}
                            {topic.examinerTrap && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                                <AlertTriangleIcon className="w-3 h-3" />
                                <span>Trap Alert</span>
                              </span>
                            )}
                          </div>

                          {/* Completion / Status Badge */}
                          <div>
                            {isCompleted ? (
                              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                <CheckIcon className="w-4 h-4 stroke-[3]" />
                              </span>
                            ) : hasNote ? (
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600">
                                In Progress
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">
                                Click to Master →
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div>
                          <h3 className="text-sm font-extrabold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed font-medium">
                            {topic.subtitle}
                          </p>
                        </div>

                        {/* Footer Info: Textbook advice & Link */}
                        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-semibold truncate max-w-[200px]">
                            📖 {topic.textbookAdvice[0]?.textbook.split(" by ")[0] || "Approved JAMB Text"}
                          </span>
                          <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Mastery Gate</span>
                            <ArrowRightIcon className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting Line to Next Stage */}
                {stageIdx < roadmap.stages.length - 1 && (
                  <div className="my-6 flex flex-col items-center">
                    <div className="w-0.5 h-8 bg-linear-to-b from-blue-500 to-primary/40"></div>
                    <div className="w-3 h-3 rotate-45 border-b-2 border-r-2 border-primary/60 -mt-1.5"></div>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6B. VIEW MODE CONTENT: TRADITIONAL DOCUMENT OUTLINE ── */}
      {viewMode === "outline" && (
        <section className="space-y-8 animate-fadeIn">
          {filteredSections.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No Topics Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                No syllabus topics matched your search &quot;{searchQuery}&quot;. Clear your search query or reset section filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSection("all");
                  setFilterMastery("all");
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <div className="space-y-0.5">
                    <h2 className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      {sec.sectionTitle}
                    </h2>
                    <span className="text-xs text-muted-foreground">
                      {sec.topics.length} Syllabus Topic{sec.topics.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="space-y-4">
                  {sec.topics.map((topic) => {
                    const topicKey = `${curriculum.id}-t${topic.topicNumber}`;
                    const isMastered = !!masteredTopics[topicKey] || Boolean(progressMap[topicKey]?.isCompleted);
                    const isExpanded = !!expandedTopics[topic.topicNumber];

                    return (
                      <div
                        key={topic.topicNumber}
                        className={`p-5 sm:p-6 rounded-2xl bg-card border transition-all duration-200 shadow-xs space-y-4 ${
                          isMastered
                            ? "border-emerald-500/40 bg-emerald-500/[0.02]"
                            : "border-border hover:border-blue-400/50"
                        }`}
                      >
                        {/* Topic Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider">
                                Topic {topic.topicNumber}
                              </span>
                              {topic.highYield && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wide">
                                  <FlameIcon className="w-3 h-3 text-amber-500" />
                                  <span>High Yield</span>
                                </span>
                              )}
                              {isMastered && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide">
                                  <CheckIcon className="w-3 h-3 text-emerald-500" />
                                  <span>Mastered</span>
                                </span>
                              )}
                            </div>

                            <h3 className="text-base sm:text-lg font-extrabold text-foreground leading-snug">
                              {topic.title}
                            </h3>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleOpenCurriculumTopic(topic.topicNumber)}
                              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
                              <span>Mastery Gate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleMastery(topicKey)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isMastered
                                  ? "bg-emerald-500 text-white shadow-xs"
                                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border"
                              }`}
                            >
                              {isMastered ? (
                                <CheckIcon className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-3.5 h-3.5 rounded-full border border-current" />
                              )}
                              <span>{isMastered ? "Mastered" : "Check Off"}</span>
                            </button>
                          </div>
                        </div>

                        {/* Contents Breakdown */}
                        <div className="space-y-2 pt-1 border-t border-border/50">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Syllabus Contents To Learn:
                          </span>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-foreground/90 pl-4 list-disc">
                            {topic.contents.map((item, cIdx) => (
                              <li key={cIdx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Official Objectives Accordion / Preview */}
                        <div className="space-y-2 pt-2 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              Official JAMB Objectives (Candidates should be able to):
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleExpand(topic.topicNumber)}
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                            >
                              {isExpanded ? "▲ Collapse Objectives" : `▼ View Objectives (${topic.objectives.length})`}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1.5 animate-fadeIn">
                              <ul className="space-y-1 text-xs text-foreground/80 pl-4 list-disc">
                                {topic.objectives.map((obj, oIdx) => (
                                  <li key={oIdx} className="leading-relaxed">
                                    {obj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Examiner Trap Tip if available */}
                        {topic.trapAlert && (
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                            <AlertTriangleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Examiner Trap: </strong>
                              <span>{topic.trapAlert}</span>
                            </div>
                          </div>
                        )}

                        {/* Quick Practice in CBT Drill Button */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenCurriculumTopic(topic.topicNumber)}
                            className="px-4 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <SparklesIcon className="w-3.5 h-3.5" />
                            <span>Write Feynman Note &amp; Take 5–15 CBT Test</span>
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleExpand(topic.topicNumber)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {isExpanded ? "Hide Details" : "Show Full Examination Details"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* ── 7. FOOTER CALL TO ACTION ── */}
      <section className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground">
              Ready to Test Your {curriculum.subjectName} Accuracy Under Timed CBT Conditions?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Launch an official 120-minute UTME simulation with authentic question grids, calculator, and AI diagnostic breakdown.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onSwitchToMockExam ? (
              <button
                type="button"
                onClick={onSwitchToMockExam}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Launch Mock Exam Simulation →
              </button>
            ) : (
              <Link
                href="/study?tab=mock-exam"
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Launch Mock Exam Simulation →
              </Link>
            )}
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-2xl bg-card border border-border hover:bg-muted font-bold text-xs text-foreground transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Slide-Over Topic Mastery Drawer (Shared between Flowchart & Outline) */}
      <TopicMasteryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        topic={selectedTopic}
        progress={selectedTopic ? progressMap[selectedTopic.id] : null}
        onTopicCompleted={handleTopicCompleted}
      />
    </div>
  );
}

