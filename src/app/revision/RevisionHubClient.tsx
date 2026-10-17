"use client";

import { useState } from "react";
import Link from "next/link";
import { useGamification } from "@/components/gamification/XPToast";

export interface RevisionQuestion {
  failedRecordId: string;
  questionId: string;
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  topic: string;
  concept: string;
  reviewCount: number;
  lastPracticedAt: string;
}

interface RevisionHubClientProps {
  initialQuestions: RevisionQuestion[];
  initialTotal: number;
}

export default function RevisionHubClient({
  initialQuestions,
  initialTotal,
}: RevisionHubClientProps) {
  const { triggerXPToast } = useGamification();

  const [questions, setQuestions] = useState<RevisionQuestion[]>(initialQuestions);
  const [totalInQueue, setTotalInQueue] = useState<number>(initialTotal);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctOption: string;
    explanation: string;
    message: string;
  } | null>(null);

  const [masteredCount, setMasteredCount] = useState<number>(0);
  const [batchPage, setBatchPage] = useState<number>(1);
  const [isLoadingNextBatch, setIsLoadingNextBatch] = useState<boolean>(false);

  const currentQuestion: RevisionQuestion | undefined = questions[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (feedback) return; // locked once checked
    setSelectedOption(optId);
  };

  const handleConfirmAnswer = async () => {
    if (!currentQuestion || !selectedOption || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/mock-exam/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.questionId,
          selectedOption,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to check answer");
      }

      const data = await res.json();
      setFeedback(data);

      if (data.isCorrect) {
        setMasteredCount((prev) => prev + 1);
        setTotalInQueue((prev) => Math.max(0, prev - 1));
        triggerXPToast({
          points: 15,
          eventType: "QUESTION_ANSWERED",
          message: "Concept Mastered! +15 XP 🎯",
        });
      }
    } catch (err) {
      console.error("Revision submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);

    // If answered correctly, remove from local questions list
    if (feedback?.isCorrect) {
      const updated = questions.filter((_, idx) => idx !== currentIndex);
      setQuestions(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(Math.max(0, updated.length - 1));
      }
    } else {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
    }
  };

  const handleLoadBatch = async (page: number) => {
    setIsLoadingNextBatch(true);
    try {
      const res = await fetch(`/api/mock-exam/revision?page=${page}&limit=10`);
      if (!res.ok) throw new Error("Failed to load batch");
      const data = await res.json();
      setQuestions(data.questions);
      setTotalInQueue(data.totalReview ?? data.totalQuestions ?? 0);
      setBatchPage(page);
      setCurrentIndex(0);
      setSelectedOption(null);
      setFeedback(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingNextBatch(false);
    }
  };

  // ── EMPTY STATE: All Caught Up! ──
  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/15 via-card to-emerald-500/10 border-2 border-amber-500/30 p-8 sm:p-12 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-4xl shadow-inner shadow-amber-500/20">
            🏆
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-500/30">
              <span>ALL PRACTICED CONCEPTS MASTERED</span>
              <span>•</span>
              <span>REVISION QUEUE CLEAR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              You&apos;re All Caught Up!
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              You don&apos;t have any questions flagged for review right now. Every concept you&apos;ve practiced is currently mastered!
            </p>

            {masteredCount > 0 && (
              <div className="inline-block px-4 py-2 rounded-2xl bg-muted/60 border border-border text-xs font-extrabold text-foreground">
                🎉 You locked down <span className="text-amber-500">{masteredCount}</span> concept{masteredCount === 1 ? "" : "s"} in this revision session!
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/mock-exam"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Take Full Mock Exam</span>
              <span>⏱️</span>
            </Link>
            <Link
              href="/study"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs border border-border transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Syllabus Topics</span>
              <span>📚</span>
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-card hover:bg-muted text-foreground font-bold text-xs border border-border/80 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Dashboard</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* ── TOP HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/15 via-card to-blue-500/10 border-2 border-amber-500/30 p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-black border border-amber-500/30">
              <span>🎯 ACTIVE RECALL HUB</span>
              <span>•</span>
              <span>SPACED REPETITION ENGINE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Revision Hub
            </h1>

            <p className="text-xs sm:text-sm text-foreground/90 font-medium max-w-xl leading-relaxed">
              Review your previous practice and master these concepts! Turn tricky questions into guaranteed marks with targeted recall drills.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-card border border-border shadow-xs text-center min-w-32">
              <span className="text-2xl font-black text-amber-500 block leading-none">
                {totalInQueue}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground block mt-1">
                Questions to Review
              </span>
            </div>
            {masteredCount > 0 && (
              <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                +{masteredCount} Mastered Today ✨
              </span>
            )}
          </div>
        </div>

        {/* Batch navigation & stats strip */}
        <div className="mt-6 pt-5 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-muted-foreground">
              Batch #{batchPage}
            </span>
            <span className="text-border">•</span>
            <span className="font-extrabold text-foreground">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {batchPage > 1 && (
              <button
                type="button"
                disabled={isLoadingNextBatch}
                onClick={() => handleLoadBatch(batchPage - 1)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold cursor-pointer disabled:opacity-50"
              >
                ← Prev Batch
              </button>
            )}
            {totalInQueue > batchPage * 10 && (
              <button
                type="button"
                disabled={isLoadingNextBatch}
                onClick={() => handleLoadBatch(batchPage + 1)}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold cursor-pointer disabled:opacity-50"
              >
                Next Batch →
              </button>
            )}
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground font-semibold hover:underline ml-2"
            >
              Exit to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* ── QUESTION PRACTICE CARD ── */}
      {currentQuestion && (
        <div className="bg-card border-2 border-border/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black text-xs border border-blue-500/20">
                {currentQuestion.subject}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold text-[11px] border border-border">
                {currentQuestion.year} JAMB Past Question
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>Concept Tested:</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                {currentQuestion.concept}
              </span>
            </div>
          </div>

          {/* Question Stem */}
          <div className="p-5 sm:p-6 rounded-2xl bg-muted/40 border border-border">
            <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed whitespace-pre-wrap">
              {currentQuestion.text}
            </p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let optionStyle =
                "border-border/80 bg-card hover:border-amber-400/60 hover:bg-muted/40 text-foreground";

              if (feedback) {
                if (opt.id === feedback.correctOption) {
                  optionStyle =
                    "border-emerald-500 bg-emerald-500/15 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs";
                } else if (isSelected && !feedback.isCorrect) {
                  optionStyle =
                    "border-amber-500 bg-amber-500/15 text-amber-950 dark:text-amber-200";
                } else {
                  optionStyle = "border-border/50 bg-card/50 text-muted-foreground opacity-60";
                }
              } else if (isSelected) {
                optionStyle =
                  "border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/10 text-foreground font-bold";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isSubmitting || feedback !== null}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.99] disabled:cursor-default ${optionStyle}`}
                >
                  <span
                    className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors ${
                      isSelected
                        ? "bg-amber-500 text-slate-950"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {opt.id}
                  </span>
                  <span className="pt-1 text-sm sm:text-base leading-relaxed">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions & Feedback Reveal */}
          <div className="pt-2">
            {!feedback ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-muted-foreground font-semibold">
                  {selectedOption
                    ? `Option ${selectedOption} selected`
                    : "Select an option to test your recall"}
                </span>

                <button
                  type="button"
                  disabled={!selectedOption || isSubmitting}
                  onClick={handleConfirmAnswer}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>{isSubmitting ? "Checking..." : "Confirm Answer"}</span>
                  <span>✓</span>
                </button>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Result Message Card */}
                <div
                  className={`p-5 rounded-2xl border-2 flex items-start gap-3.5 ${
                    feedback.isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                  }`}
                >
                  <span className="text-2xl shrink-0">
                    {feedback.isCorrect ? "🎉" : "💡"}
                  </span>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm">
                      {feedback.isCorrect
                        ? "Mastered! ✨ Great work locking down this concept."
                        : "Not quite yet! You're building mastery with every try."}
                    </h4>
                    <p className="text-xs leading-relaxed opacity-90">
                      {feedback.isCorrect
                        ? "This question has been successfully resolved from your revision queue. +15 XP awarded!"
                        : `The examiner answer is (${feedback.correctOption}). Review the working below to solidify this formula.`}
                    </p>
                  </div>
                </div>

                {/* Examiner Explanation */}
                <div className="p-5 rounded-2xl bg-muted/60 border border-border/80 space-y-2 text-xs">
                  <div className="font-extrabold text-foreground flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Examiner Solution & Concept Working:</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap">
                    {feedback.explanation}
                  </p>
                </div>

                {/* Next Question Navigation */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                  >
                    <span>Next Question</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
