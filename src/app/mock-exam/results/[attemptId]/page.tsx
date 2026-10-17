import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getExamResult } from "@/lib/exam";

export const metadata: Metadata = {
  title: "Mock Exam Scorecard & Performance Analysis | PrepSmart",
  description:
    "Detailed score breakdown, accuracy percentages, subject performance, and examiner solutions for your completed JAMB mock exam.",
};

interface ResultPageProps {
  params: Promise<{ attemptId: string }>;
}

function ResultsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 rounded-3xl bg-muted/60 border border-border" />

      {/* Subject Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/50 border border-border" />
        ))}
      </div>

      {/* Review List Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-60 bg-muted rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-muted/40 border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function ResultContent({ params }: ResultPageProps) {
  await connection();
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { attemptId } = await params;

  let result;
  try {
    result = await getExamResult(userId, attemptId);
  } catch {
    notFound();
  }

  const { score, totalQuestions, accuracyPct, subjectBreakdown, scoredQuestions, subjectMode } =
    result;

  const passed = accuracyPct >= 50;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner / Scorecard */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-10 border border-blue-800/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-bold border border-white/15">
              <span>{subjectMode === "four_subjects" ? "Full 4-Subject UTME Mock" : "Single Subject Test"}</span>
              <span>•</span>
              <span>Graded CBT Attempt</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              {passed ? "Mastery in Motion! 🎉" : "Great Practice Attempt! Every Step Builds Confidence 🚀"}
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/80 max-w-lg leading-relaxed">
              Your exam has been graded server-side against official JAMB answers. Review your accuracy, examiner working, and subject insights below to lock in key concepts.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/revision"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center gap-1.5"
              >
                <span>🎯</span>
                <span>Open Revision Hub</span>
              </Link>
              <Link
                href="/mock-exam"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all"
              >
                Take Another Mock Exam
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>

          {/* Big Score Card */}
          <div className="flex items-center gap-4 shrink-0 bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/15 text-center">
            <div>
              <div className="text-5xl sm:text-6xl font-black text-amber-400 tabular-nums">
                {score}
                <span className="text-2xl text-blue-200 font-bold">/{totalQuestions}</span>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mt-1">
                Total Score
              </div>
            </div>
            <div className="h-12 w-px bg-white/20" />
            <div>
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 tabular-nums">
                {accuracyPct}%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mt-1">
                Accuracy
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-foreground">
          Subject Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(subjectBreakdown).map(([subject, stats]) => (
            <div
              key={subject}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {subject}
                </span>
                <span
                  className={`text-xs font-black ${
                    stats.pct >= 60 ? "text-emerald-600" : stats.pct >= 40 ? "text-amber-600" : "text-rose-600"
                  }`}
                >
                  {stats.pct}%
                </span>
              </div>

              <div className="text-2xl font-black text-foreground tabular-nums">
                {stats.score} <span className="text-sm text-muted-foreground font-normal">/ {stats.total}</span>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stats.pct >= 60 ? "bg-emerald-600" : stats.pct >= 40 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${stats.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-foreground">
            Question-by-Question Review
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">
            {scoredQuestions.length} Questions
          </span>
        </div>

        <div className="space-y-4">
          {scoredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                q.isCorrect
                  ? "bg-card border-emerald-500/30"
                  : "bg-card border-amber-500/30"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                      q.isCorrect
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-slate-950 font-black"
                    }`}
                  >
                    Question {idx + 1} • {q.isCorrect ? "Mastered ✓" : "Needs Practice 💡"}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {q.subject}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold">
                    {q.topic}
                  </span>
                </div>

                {q.wasGuessed && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 border border-purple-500/20">
                    🎲 Marked as Guessed
                  </span>
                )}
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                {q.text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt) => {
                  const isUserSelection = q.userAnswer === opt.id;
                  const isCorrect = q.correctOption === opt.id;

                  let style = "bg-muted/40 border-border text-foreground";
                  if (isCorrect) {
                    style = "bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold";
                  } else if (isUserSelection && !isCorrect) {
                    style = "bg-amber-500/15 border-amber-500 text-amber-950 dark:text-amber-200";
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-2xl border-2 flex items-start gap-3 text-xs ${style}`}
                    >
                      <span className="font-extrabold shrink-0 w-6 h-6 rounded-lg bg-card/80 border border-border/80 flex items-center justify-center">
                        {opt.id}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{opt.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Examiner Solution */}
              <div className="rounded-2xl bg-muted/50 p-4 border border-border/80 text-xs space-y-1.5">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Examiner Solution & Concept:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">{q.concept}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {q.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ExamResultPage({ params }: ResultPageProps) {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultContent params={params} />
    </Suspense>
  );
}
