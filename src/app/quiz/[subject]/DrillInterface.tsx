"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { awardUserXPAction } from "@/actions/gamification";
import { useGamification } from "@/components/gamification/XPToast";

export interface DrillOption {
  id: string; // "A" | "B" | "C" | "D"
  text: string;
}

export interface DrillQuestion {
  id: string;
  subject: string;
  year: number;
  text: string;
  options: DrillOption[];
  correctOption: string;
  explanation: string;
  difficulty: string;
}

interface DrillInterfaceProps {
  questions: DrillQuestion[];
  subject: string;
  topicName?: string;
  userId?: string;
}

interface QuestionAnswerState {
  selectedOption: string;
  isChecked: boolean;
  isCorrect: boolean;
}

export default function DrillInterface({
  questions,
  subject,
  topicName,
  userId,
}: DrillInterfaceProps) {
  const { triggerXPToast } = useGamification();

  // Navigation & state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerState>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [startTime] = useState<number>(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<"all" | "review" | "mastered">("all");

  // Timer for duration tracking
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentAnswer = answers[currentQ?.id];

  // Calculate stats
  const stats = useMemo(() => {
    const answeredEntries = Object.values(answers).filter((a) => a.isChecked);
    const correctCount = answeredEntries.filter((a) => a.isCorrect).length;
    const answeredCount = answeredEntries.length;
    const accuracy =
      answeredCount > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const earnedXP = correctCount * 5 + (isCompleted ? 50 : 0);

    return {
      answeredCount,
      correctCount,
      accuracy,
      earnedXP,
    };
  }, [answers, totalQuestions, isCompleted]);

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (currentAnswer?.isChecked) return; // Prevent changing after checking
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOption: optionId,
        isChecked: false,
        isCorrect: false,
      },
    }));
  };

  // Immediate evaluation on "Check Answer"
  const handleCheckAnswer = async () => {
    if (!currentAnswer?.selectedOption || currentAnswer.isChecked) return;

    const isCorrect = currentAnswer.selectedOption === currentQ.correctOption;

    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        selectedOption: currentAnswer.selectedOption,
        isChecked: true,
        isCorrect,
      },
    }));

    // Trigger Gamification & persist XP
    if (isCorrect) {
      triggerXPToast({
        points: 5,
        eventType: "QUESTION_ANSWERED",
        message: "Conceptual Precision! +5 XP 🎯",
      });
      if (userId) {
        awardUserXPAction(userId, "QUESTION_ANSWERED").catch(() => {});
      }
    }
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleCompleteDrill();
    }
  };

  const handleCompleteDrill = async () => {
    setIsCompleted(true);
    triggerXPToast({
      points: 50,
      eventType: "TOPIC_COMPLETED",
      message: "CBT Drill Completed! +50 XP 🏆",
    });
    if (userId) {
      awardUserXPAction(userId, "TOPIC_COMPLETED").catch(() => {});
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  // ==========================================
  // COMPLETION VIEW (Celebratory State)
  // ==========================================
  if (isCompleted) {
    const isHighMastery = stats.accuracy >= 70;

    const filteredQuestions = questions.filter((q) => {
      const ans = answers[q.id];
      if (reviewFilter === "mastered") return ans?.isCorrect;
      if (reviewFilter === "review") return ans && !ans.isCorrect;
      return true;
    });

    return (
      <div className="relative min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-500">
        {/* Ambient liquid glow background */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Celebratory Hero Card - Apple Liquid Glass */}
        <div className="relative overflow-hidden rounded-3xl bg-card/80 dark:bg-card/60 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-tr from-amber-400/20 via-blue-500/20 to-emerald-400/20 border border-white/30 dark:border-white/10 shadow-inner text-4xl animate-bounce-short">
            🏆
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <span>{subject} Practice Drill</span>
              {topicName && <span>• {topicName}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {isHighMastery
                ? "Drill Completed! Exceptional Mastery! 🎉"
                : "Drill Completed! Tremendous Effort! 🌟"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {isHighMastery
                ? "Outstanding work! You demonstrated sharp speed and deep conceptual accuracy on these official UTME questions."
                : "Great practice session! Consistent active practice is the proven secret to building speed and scoring 300+ in JAMB UTME."}
            </p>
          </div>

          {/* 4 Liquid Glass Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Accuracy
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {stats.accuracy}%
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                {stats.correctCount} / {totalQuestions} Correct
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Time Spent
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {formatDuration(elapsedSeconds)}
              </div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                Avg ~{Math.round(elapsedSeconds / (totalQuestions || 1))}s / q
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                XP Earned
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
                +{stats.earnedXP}
              </div>
              <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                Active Recall Bonus
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xs">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </div>
              <div className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 mt-1.5 truncate">
                {isHighMastery ? "Mastered" : "Strengthened"}
              </div>
              <div className="text-[11px] text-muted-foreground font-semibold mt-0.5">
                Syllabus Progress
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/60">
            <Link
              href="/study"
              className="px-5 py-3 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs sm:text-sm font-bold border border-border shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              ← Back to Study Syllabus
            </Link>

            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setCurrentIndex(0);
                setIsCompleted(false);
              }}
              className="px-5 py-3 rounded-2xl bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-bold border border-border shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              🔄 Practice Drill Again
            </button>

            <Link
              href="/mock-exam"
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              ⚡ Take Full CBT Mock Exam →
            </Link>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Examiner Solutions &amp; Concepts Review
              </h2>
              <p className="text-xs text-muted-foreground">
                Reinforce each concept with examiner rationale.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-card border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setReviewFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  reviewFilter === "all"
                    ? "bg-blue-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({questions.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("mastered")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  reviewFilter === "mastered"
                    ? "bg-emerald-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mastered ({stats.correctCount})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter("review")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  reviewFilter === "review"
                    ? "bg-amber-600 text-white font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Needs Practice ({totalQuestions - stats.correctCount})
              </button>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const ans = answers[q.id];
              const isCorrect = ans?.isCorrect;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl bg-card/70 backdrop-blur-md border border-border/80 p-5 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground">
                        Question #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        JAMB {q.year}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isCorrect
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {isCorrect ? "✓ Mastered" : "💡 Learning Step"}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {q.text}
                  </p>

                  {/* Options Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt) => {
                      const isCandidatePick = ans?.selectedOption === opt.id;
                      const isCorrectOpt = q.correctOption === opt.id;

                      let borderClass = "border-border/60 bg-muted/20 text-muted-foreground";
                      if (isCorrectOpt) {
                        borderClass =
                          "border-emerald-500/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-bold";
                      } else if (isCandidatePick && !isCorrect) {
                        borderClass =
                          "border-amber-500/60 bg-amber-500/10 text-amber-800 dark:text-amber-200";
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${borderClass}`}
                        >
                          <span className="w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[10px] shrink-0">
                            {opt.id}
                          </span>
                          <span className="truncate">{opt.text}</span>
                          {isCorrectOpt && (
                            <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                              Official Answer
                            </span>
                          )}
                          {isCandidatePick && !isCorrectOpt && (
                            <span className="ml-auto text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Step-by-Step Examiner Solution */}
                  {q.explanation && (
                    <div className="p-3.5 rounded-xl bg-blue-500/5 dark:bg-blue-950/20 border border-blue-500/20 text-xs space-y-1">
                      <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <span>💡 Examiner Step-by-Step Solution:</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE FOCUS MODE DRILL
  // ==========================================
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div
      className={`relative min-h-[90vh] py-6 sm:py-10 px-4 sm:px-6 transition-all duration-300 ${
        focusMode ? "max-w-3xl mx-auto" : "max-w-4xl mx-auto"
      }`}
    >
      {/* Decorative ambient glass light */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Glass Navigation Bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-card/75 dark:bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/study"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted border border-border/80 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>←</span>
            <span>Study Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wide">
              {subject} Drill
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
              Timed UTME Practice
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-xl bg-muted/60 border border-border/80 text-xs font-bold text-foreground">
            ⏱️ {formatDuration(elapsedSeconds)}
          </div>

          <button
            type="button"
            onClick={() => setFocusMode((prev) => !prev)}
            title={focusMode ? "Exit Focus Mode" : "Enter Distraction-Free Focus Mode"}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              focusMode
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-muted/50 hover:bg-muted border-border/80 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{focusMode ? "✨ Focus On" : "👓 Focus Mode"}</span>
          </button>
        </div>
      </header>

      {/* Progress Track */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span className="text-foreground">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">
            {progressPercent}% Complete
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted/80 overflow-hidden p-0.5 border border-border/40">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Apple Liquid Glass Drill Container */}
      <main className="relative rounded-3xl bg-card/85 dark:bg-card/70 backdrop-blur-2xl border border-white/25 dark:border-white/10 p-6 sm:p-9 shadow-2xl space-y-7 transition-all duration-200">
        {/* Question Header & Stem */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-muted text-muted-foreground uppercase tracking-wider">
              JAMB UTME {currentQ.year}
            </span>

            {currentAnswer?.isChecked && (
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border animate-in fade-in-50 duration-200 flex items-center gap-1.5 ${
                  currentAnswer.isCorrect
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                }`}
              >
                <span>{currentAnswer.isCorrect ? "✓ Mastered" : "💡 Learning Step"}</span>
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed sm:leading-loose">
            {currentQ.text}
          </h2>
        </div>

        {/* Options List - Interactive Liquid Glass Cards */}
        <div className="space-y-3" role="radiogroup" aria-label="Question options">
          {currentQ.options.map((option) => {
            const isSelected = currentAnswer?.selectedOption === option.id;
            const isChecked = currentAnswer?.isChecked;
            const isCorrectOption = currentQ.correctOption === option.id;

            let cardStyles =
              "bg-card/70 hover:bg-card/90 border-border/80 text-foreground hover:border-blue-500/40";
            let circleStyles = "bg-muted text-foreground border-border";

            if (isSelected && !isChecked) {
              cardStyles =
                "bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 dark:text-blue-100 shadow-xs";
              circleStyles = "bg-blue-600 text-white border-blue-600 font-extrabold";
            } else if (isChecked) {
              if (isCorrectOption) {
                cardStyles =
                  "bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs";
                circleStyles =
                  "bg-emerald-600 text-white border-emerald-600 font-black";
              } else if (isSelected && !isCorrectOption) {
                cardStyles =
                  "bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/20 text-amber-950 dark:text-amber-100 shadow-xs";
                circleStyles = "bg-amber-600 text-white border-amber-600 font-bold";
              } else {
                cardStyles = "opacity-60 bg-muted/20 border-border/40 text-muted-foreground";
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isChecked}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 sm:p-4.5 rounded-2xl border text-left transition-all duration-150 flex items-center gap-3.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${cardStyles}`}
              >
                <span
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${circleStyles}`}
                >
                  {isChecked && isCorrectOption ? "✓" : option.id}
                </span>

                <span className="text-sm sm:text-base font-medium flex-1">
                  {option.text}
                </span>

                {isChecked && isCorrectOption && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Correct Answer
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback Box (Positive UX Copy) */}
        {currentAnswer?.isChecked && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border animate-in fade-in-50 slide-in-from-bottom-2 duration-300 space-y-3 ${
              currentAnswer.isCorrect
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
                : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {currentAnswer.isCorrect ? "🎯" : "💡"}
              </span>
              <h3 className="font-extrabold text-sm sm:text-base">
                {currentAnswer.isCorrect
                  ? "Outstanding! That's precisely right! ✨"
                  : `Not quite! The correct answer is Option ${currentQ.correctOption}. Keep going! 💡`}
              </h3>
            </div>

            {currentQ.explanation && (
              <div className="pt-2 border-t border-border/40 text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-1">
                <span className="font-bold text-foreground block">
                  Examiner Rationale &amp; Step-by-Step Solution:
                </span>
                <p>{currentQ.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              currentIndex === 0
                ? "opacity-40 cursor-not-allowed bg-muted/30 border-border/40 text-muted-foreground"
                : "bg-card hover:bg-muted text-foreground border-border shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            ← Previous Question
          </button>

          <div className="flex items-center gap-2.5">
            {!currentAnswer?.isChecked ? (
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={!currentAnswer?.selectedOption}
                className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-xs ${
                  currentAnswer?.selectedOption
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                    : "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border"
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
              >
                <span>
                  {currentIndex === totalQuestions - 1
                    ? "Finish Drill & View Results"
                    : "Next Question"}
                </span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Floating Liquid Glass Question Quick-Jump Dock */}
      <footer className="mt-6 p-3 rounded-2xl bg-card/75 dark:bg-card/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold text-muted-foreground shrink-0 pl-1">
          Jump:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {questions.map((q, idx) => {
            const ans = answers[q.id];
            const isCurrent = idx === currentIndex;

            let pillStyle = "bg-muted/60 text-muted-foreground border-border/60";
            if (ans?.isChecked) {
              pillStyle = ans.isCorrect
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold"
                : "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold";
            }

            if (isCurrent) {
              pillStyle += " ring-2 ring-blue-500 font-extrabold scale-110";
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg text-xs border flex items-center justify-center shrink-0 transition-transform cursor-pointer hover:scale-105 ${pillStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCompleteDrill}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0 pr-1 cursor-pointer"
        >
          End Drill
        </button>
      </footer>
    </div>
  );
}
