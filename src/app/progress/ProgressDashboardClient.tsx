"use client";

import React from "react";
import Link from "next/link";
import { EnvironmentalLighting } from "@/components/ui/EnvironmentalLighting";
import { MotivationalBanner } from "./components/MotivationalBanner";
import { ReadinessRing } from "./components/ReadinessRing";
import { ConceptsToReview } from "./components/ConceptsToReview";
import { SubjectMasteryCards } from "./components/SubjectMasteryCards";
import type { CandidateProgressData } from "@/lib/progress";

export interface ProgressDashboardClientProps {
  data: CandidateProgressData;
}

export function ProgressDashboardClient({ data }: ProgressDashboardClientProps) {
  return (
    <EnvironmentalLighting>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Motivational Micro-Interaction Banner */}
        <MotivationalBanner
          message={data.motivationalMessage}
          weeklyQuestionsCount={data.weeklyQuestionsCount}
          activeStreak={data.activeStreak}
          xp={data.user.xp}
        />

        {/* Core Readiness & Areas for Growth Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Exam Readiness Ring */}
          <div className="lg:col-span-5 flex flex-col">
            <ReadinessRing
              score={data.examReadinessScore}
              targetScore={data.targetScore}
            />
          </div>

          {/* Right Column: Concepts to Review (Areas for Growth) */}
          <div className="lg:col-span-7 flex flex-col">
            <ConceptsToReview concepts={data.conceptsToReview} />
          </div>
        </div>

        {/* Subject Mastery Breakdown */}
        <div className="pt-2">
          <SubjectMasteryCards subjects={data.subjectMastery} />
        </div>

        {/* Quick Access Action Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Card 1: Mock Exam */}
          <div className="group relative p-6 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md hover:shadow-liquid-lg dark:shadow-liquid-dark-md dark:hover:shadow-liquid-dark-dock transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xl">⏱️</span>
              <h3 className="font-extrabold text-base text-[#1D1D1F] dark:text-[#F5F5F7]">
                Full UTME Mock Exam
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                120-minute timed simulation with authentic question grid and BODMAS calculator.
              </p>
            </div>
            <Link
              href="/mock-exam"
              className="mt-5 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Launch Mock Exam</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Card 2: Revision Hub */}
          <div className="group relative p-6 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md hover:shadow-liquid-lg dark:shadow-liquid-dark-md dark:hover:shadow-liquid-dark-dock transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xl">🎯</span>
              <h3 className="font-extrabold text-base text-[#1D1D1F] dark:text-[#F5F5F7]">
                Revision Hub
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Reinforce high-yield concepts with spaced repetition and step-by-step examiner solutions.
              </p>
            </div>
            <Link
              href="/revision"
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Revision Hub</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>

          {/* Card 3: Syllabus Modules */}
          <div className="group relative p-6 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md hover:shadow-liquid-lg dark:shadow-liquid-dark-md dark:hover:shadow-liquid-dark-dock transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xl">📚</span>
              <h3 className="font-extrabold text-base text-[#1D1D1F] dark:text-[#F5F5F7]">
                Syllabus & Course Modules
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Explore comprehensive curriculum notes and high-yield examiner traps for each subject.
              </p>
            </div>
            <Link
              href="/study"
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Explore Syllabus</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </EnvironmentalLighting>
  );
}
