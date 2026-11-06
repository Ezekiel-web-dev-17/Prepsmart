"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCurriculumHub from "./StudyCurriculumHub";
import MockExamClient from "@/app/mock-exam/MockExamClient";
import SubjectSyllabusView from "./SubjectSyllabusView";
import { useUserContext } from "@/context/UserContext";
import {
  BookOpenIcon,
  TargetIcon,
  LightbulbIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
} from "@/components/ui/icons";
import {
  getSubjectCurriculum,
  normalizeSubjectSlug,
  normalizeStreamSlug,
} from "./curriculum-data";

interface StudyHubViewProps {
  userSubjects: string[];
  initialTab?: "curriculum" | "mock-exam" | "subject-syllabus";
  initialStream?: "science" | "commercial" | "arts";
  initialSubject?: string;
  hasSubjectParam?: boolean;
  isAuthenticated?: boolean;
}

export default function StudyHubView({
  userSubjects,
  initialTab = "curriculum",
  initialStream = "science",
  initialSubject = "english",
  hasSubjectParam = false,
  isAuthenticated = false,
}: StudyHubViewProps) {
  const router = useRouter();
  const {
    user,
    department: userDepartment,
    selectedSubjects: contextSubjects,
    targetScore,
    isSignedIn: contextSignedIn,
  } = useUserContext();

  const isUserAuthenticated = isAuthenticated || contextSignedIn;
  const effectiveStream = hasSubjectParam ? initialStream : (userDepartment || initialStream);
  const effectiveSubjects = userSubjects && userSubjects.length > 0 ? userSubjects : contextSubjects;

  const [activeTab, setActiveTab] = useState<"curriculum" | "mock-exam" | "subject-syllabus">(
    initialTab === "curriculum" && (isAuthenticated || contextSignedIn)
      ? "subject-syllabus"
      : initialTab
  );
  const [currentStream, setCurrentStream] = useState<"science" | "commercial" | "arts">(
    effectiveStream
  );
  const [currentSubject, setCurrentSubject] = useState<string>(initialSubject);

  // Sync state if props change (e.g. user navigates between query params)
  useEffect(() => {
    if (initialTab === "curriculum" && isUserAuthenticated) {
      setActiveTab("subject-syllabus");
    } else {
      setActiveTab(initialTab);
    }
    setCurrentStream(effectiveStream);
    setCurrentSubject(initialSubject);
  }, [initialTab, effectiveStream, initialSubject, isUserAuthenticated]);

  const handleTabChange = (tab: "curriculum" | "mock-exam" | "subject-syllabus") => {
    setActiveTab(tab);
    const url = new URL(window.location.href);

    if (tab === "mock-exam") {
      url.searchParams.set("tab", "mock-exam");
    } else if (tab === "curriculum") {
      url.searchParams.delete("tab");
      url.searchParams.delete("stream");
      url.searchParams.delete("subject");
      url.searchParams.delete("department");
    } else if (tab === "subject-syllabus") {
      url.searchParams.delete("tab");
      url.searchParams.set("stream", currentStream);
      url.searchParams.set("subject", currentSubject);
    }

    window.history.replaceState({}, "", url.toString());
  };

  const handleSelectSubjectFromPill = (subjName: string) => {
    const slug = normalizeSubjectSlug(subjName);
    setCurrentSubject(slug);
    setActiveTab("subject-syllabus");
    const url = new URL(window.location.href);
    url.searchParams.delete("tab");
    url.searchParams.set("stream", currentStream);
    url.searchParams.set("subject", slug);
    window.history.replaceState({}, "", url.toString());
  };

  // Obtain rich curriculum data for current stream & subject
  const currentCurriculum = getSubjectCurriculum(currentStream, currentSubject);

  const streamBadgeColors = {
    science: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    commercial: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    arts: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Personalized Candidate Context Header (Signed-in candidates) */}
      {isUserAuthenticated && user && (
        <section className="rounded-3xl border border-blue-500/20 bg-linear-to-r from-blue-900/10 via-card to-indigo-900/10 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Active Study Plan
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    streamBadgeColors[user.departmentStream || user.department]
                  }`}
                >
                  {user.departmentStream || user.department} Stream
                </span>
                <span className="text-xs font-bold text-foreground bg-muted px-2.5 py-0.5 rounded-full">
                  Target: <strong>{targetScore} pts</strong>
                </span>
                {user.dailyStudyMinutes && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2.5 py-0.5 rounded-full">
                    <ClockIcon className="w-3 h-3 text-muted-foreground" />
                    <span>{user.dailyStudyMinutes}m daily ({user.preferredStudyTime})</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Welcome back, {user.name} 👋
              </h2>
              <p className="text-xs text-muted-foreground">
                Your syllabus topics and CBT simulations are tailored to your target score and subjects:
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/profile"
                className="text-xs font-bold px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                Edit Plan
              </Link>
              <button
                type="button"
                onClick={() => handleTabChange("mock-exam")}
                className="text-xs font-extrabold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <TargetIcon className="w-3.5 h-3.5" />
                <span>Start Mock</span>
              </button>
            </div>
          </div>

          {/* Quick Subject Chips */}
          <div className="mt-4 pt-3.5 border-t border-border/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Your 4 UTME Subjects:</span>
            {effectiveSubjects.map((sub) => {
              const subSlug = normalizeSubjectSlug(sub);
              const isSelected = activeTab === "subject-syllabus" && currentSubject === subSlug;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleSelectSubjectFromPill(sub)}
                  className={`text-xs font-bold px-3 py-1 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-card hover:bg-muted text-foreground border-border"
                  }`}
                  title={`Open ${sub} Syllabus`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Interactive Visual Roadmap Feature Banner (Roadmap.sh Style) */}
      <section className="p-5 rounded-3xl bg-linear-to-r from-blue-600/15 via-indigo-600/10 to-purple-600/15 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
              NEW FEATURE
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Roadmap.sh-Style Flowchart
            </span>
          </div>
          <h3 className="text-base font-black text-foreground tracking-tight">
            Interactive Visual Learning Roadmap & AI Feynman Gates
          </h3>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Follow structured stages from foundational principles to advanced mastery. Write notes reviewed in real-time by AI, drill 5–15 authentic JAMB CBT questions with mnemonics, and master topics for +50 XP.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleTabChange("subject-syllabus")}
          className="shrink-0 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
        >
          <SparklesIcon className="w-4 h-4 text-amber-300" />
          <span>Open Syllabus Roadmap Flowchart</span>
          <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Top Level Hub Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Syllabus Roadmap & Milestones (Guest/Unauthenticated users only) */}
          {!isUserAuthenticated && (
            <button
              type="button"
              onClick={() => handleTabChange("curriculum")}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "curriculum"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <BookOpenIcon className="w-4 h-4" />
              <span>Syllabus Roadmap</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] font-black">
                All Streams
              </span>
            </button>
          )}

          {/* Tab 2: Unified JAMB Subject Syllabus & Interactive Roadmap */}
          <button
            type="button"
            onClick={() => handleTabChange("subject-syllabus")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "subject-syllabus"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <SparklesIcon className="w-4 h-4 text-blue-500" />
            <span>{currentCurriculum.subjectName} Syllabus &amp; Roadmap</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
              {currentCurriculum.totalTopics} Topics • Flowchart
            </span>
          </button>

          {/* Tab 3: JAMB CBT Mock Exam Simulator */}
          <button
            type="button"
            onClick={() => handleTabChange("mock-exam")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "mock-exam"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <TargetIcon className="w-4 h-4" />
            <span>JAMB CBT Mock Exam</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                isUserAuthenticated
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-300"
                  : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
              }`}
            >
              {isUserAuthenticated ? "120m Simulation" : "Sign In Required"}
            </span>
          </button>
        </div>

        <div className="text-xs text-muted-foreground hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Unified Study &amp; CBT Hub</span>
        </div>
      </div>

      {/* View 1: Subject Syllabus Topics View (when stream/subject is active or Tab 2 chosen) */}
      {activeTab === "subject-syllabus" && (
        <section className="animate-fadeIn">
          <SubjectSyllabusView
            curriculum={currentCurriculum}
            currentStream={currentStream}
            currentSubject={currentSubject}
            onSwitchToMockExam={() => handleTabChange("mock-exam")}
            onSwitchToCurriculumOverview={
              !isUserAuthenticated ? () => handleTabChange("curriculum") : undefined
            }
          />
        </section>
      )}

      {/* View 2: Syllabus Milestone Roadmap Overview (Guest/Unauthenticated users only) */}
      {activeTab === "curriculum" && !isUserAuthenticated && (
        <section className="space-y-6 animate-fadeIn">
          <StudyCurriculumHub onSwitchToMockExam={() => handleTabChange("mock-exam")} />
        </section>
      )}

      {/* View 3: JAMB CBT Mock Exam Simulator */}
      {activeTab === "mock-exam" && (
        <section className="space-y-6 animate-fadeIn">
          {!isUserAuthenticated ? (
            <div className="max-w-2xl mx-auto rounded-3xl bg-card border border-border p-8 sm:p-12 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
                <TargetIcon className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50 inline-block">
                  Candidate Access Only
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  Sign In to Access JAMB CBT Mock Exam
                </h3>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  The full 120-minute timed CBT simulation, authentic 8-key keyboard controls, on-screen calculator, and automatic spaced revision queue are reserved exclusively for registered candidates.
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto py-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>180 Questions across 4 Subjects</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>8-Key Keyboard Shortcuts</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Automatic Revision Queue</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Detailed Diagnostic Breakdown</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/sign-in?redirect_url=/study?tab=mock-exam"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Sign In to Start Exam</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/sign-up?redirect_url=/study?tab=mock-exam"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-card hover:bg-muted font-bold text-sm text-foreground transition-all cursor-pointer text-center"
                >
                  Create Free Account
                </Link>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleTabChange("curriculum")}
                  className="text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors cursor-pointer"
                >
                  ← Browse Syllabus Topics First
                </button>
              </div>
            </div>
          ) : (
            <MockExamClient userSubjects={effectiveSubjects} isAuthenticated={true} />
          )}
        </section>
      )}
    </div>
  );
}
