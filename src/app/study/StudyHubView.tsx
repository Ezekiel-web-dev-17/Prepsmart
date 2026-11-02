"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCurriculumHub from "./StudyCurriculumHub";
import MockExamClient from "@/app/mock-exam/MockExamClient";
import SubjectSyllabusView from "./SubjectSyllabusView";
import { BookOpenIcon, TargetIcon, LightbulbIcon, CheckCircleIcon, ArrowRightIcon } from "@/components/ui/icons";
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
  const [activeTab, setActiveTab] = useState<"curriculum" | "mock-exam" | "subject-syllabus">(
    initialTab
  );
  const [currentStream, setCurrentStream] = useState<"science" | "commercial" | "arts">(
    initialStream
  );
  const [currentSubject, setCurrentSubject] = useState<string>(initialSubject);

  // Sync state if props change (e.g. user navigates between query params)
  useEffect(() => {
    setActiveTab(initialTab);
    setCurrentStream(initialStream);
    setCurrentSubject(initialSubject);
  }, [initialTab, initialStream, initialSubject]);

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

  // Obtain rich curriculum data for current stream & subject
  const currentCurriculum = getSubjectCurriculum(currentStream, currentSubject);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Level Hub Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1: Syllabus Roadmap & Milestones */}
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

          {/* Tab 2: JAMB Subject Syllabus & Topics */}
          <button
            type="button"
            onClick={() => handleTabChange("subject-syllabus")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "subject-syllabus"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <BookOpenIcon className="w-4 h-4" />
            <span>{currentCurriculum.subjectName} Syllabus</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
              {currentCurriculum.totalTopics} Topics
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
                isAuthenticated
                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-300"
                  : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
              }`}
            >
              {isAuthenticated ? "120m Simulation" : "Sign In Required"}
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
            onSwitchToCurriculumOverview={() => handleTabChange("curriculum")}
          />
        </section>
      )}

      {/* View 2: Syllabus Milestone Roadmap Overview */}
      {activeTab === "curriculum" && (
        <section className="space-y-6 animate-fadeIn">
          <StudyCurriculumHub onSwitchToMockExam={() => handleTabChange("mock-exam")} />
        </section>
      )}

      {/* View 3: JAMB CBT Mock Exam Simulator */}
      {activeTab === "mock-exam" && (
        <section className="space-y-6 animate-fadeIn">
          {!isAuthenticated ? (
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
            <MockExamClient userSubjects={userSubjects} isAuthenticated={true} />
          )}
        </section>
      )}
    </div>
  );
}
