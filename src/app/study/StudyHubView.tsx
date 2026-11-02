"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StudyCurriculumHub from "./StudyCurriculumHub";
import MockExamClient from "@/app/mock-exam/MockExamClient";
import SubjectSyllabusView from "./SubjectSyllabusView";
import { BookOpenIcon, TargetIcon, LightbulbIcon } from "@/components/ui/icons";
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
          {/* Tab 1: 4-Week Curriculum & Roadmap */}
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
            <span>4-Week Roadmap</span>
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
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-black">
              120m Simulation
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

      {/* View 2: 4-Week Milestone Roadmap Overview */}
      {activeTab === "curriculum" && (
        <section className="space-y-6 animate-fadeIn">
          <StudyCurriculumHub onSwitchToMockExam={() => handleTabChange("mock-exam")} />
        </section>
      )}

      {/* View 3: JAMB CBT Mock Exam Simulator */}
      {activeTab === "mock-exam" && (
        <section className="space-y-6 animate-fadeIn">
          {!isAuthenticated && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <LightbulbIcon className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Tip for candidates:</strong> Sign in to your PrepSmart account to save your mock exam scores, track percentiles, and feed missed questions into your personal Revision Hub.
                </span>
              </div>
              <Link
                href="/sign-in"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shrink-0 text-center hover:bg-amber-400 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
          <MockExamClient userSubjects={userSubjects} isAuthenticated={isAuthenticated} />
        </section>
      )}
    </div>
  );
}
