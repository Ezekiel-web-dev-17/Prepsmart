"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExam } from "@/context/ExamContext";
import QuestionGrid from "./QuestionGrid";
import Calculator from "./Calculator";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

interface SubmitErrorInfo {
  title: string;
  message: string;
  canRetry: boolean;
}

interface ExamShellProps {
  onSubmitSuccess?: (attemptId: string) => void;
}

export default function ExamShell({ onSubmitSuccess }: ExamShellProps) {
  const router = useRouter();
  const {
    state,
    dispatch,
    submitExam,
    cancelExam,
    answeredCount,
    totalCount,
    currentQuestion,
  } = useExam();

  const [submitError, setSubmitError] = useState<SubmitErrorInfo | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleConfirmExit = async () => {
    setIsExiting(true);
    try {
      await cancelExam();
    } catch (err) {
      console.error("Error cancelling exam:", err);
    } finally {
      dispatch({ type: "CLOSE_EXIT_MODAL" });
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (state.isComplete && state.attemptId && onSubmitSuccess) {
      onSubmitSuccess(state.attemptId);
    }
  }, [state.isComplete, state.attemptId, onSubmitSuccess]);

  const isWarning = state.timeRemainingSeconds <= 300; // 5 min warning
  const isCritical = state.timeRemainingSeconds <= 60; // 1 min critical

  const subjectTabs = useMemo(
    () => [...new Set(state.questions.map((q) => q.subject))],
    [state.questions]
  );

  const currentAnswer = currentQuestion
    ? state.answers[currentQuestion.id]
    : undefined;

  const currentIsGuessed = currentQuestion
    ? !!state.guessedQuestions[currentQuestion.id]
    : false;

  const isLocked = state.isTimedOut || state.timeRemainingSeconds <= 0 || state.isComplete;

  const handleOptionClick = (optionId: string) => {
    if (!currentQuestion || isLocked) return;
    if (currentAnswer === optionId) {
      dispatch({ type: "DESELECT_OPTION", questionId: currentQuestion.id });
    } else {
      dispatch({ type: "SELECT_OPTION", questionId: currentQuestion.id, option: optionId });
    }
  };

  const handleNext = () => {
    if (state.currentIndex < state.questions.length - 1) {
      dispatch({ type: "NEXT_QUESTION" });
    }
  };

  const handlePrev = () => {
    if (state.currentIndex > 0) {
      dispatch({ type: "PREV_QUESTION" });
    }
  };

  const handleSubmitConfirmed = async () => {
    setSubmitError(null);
    try {
      await submitExam();
    } catch (err) {
      // Secure user-facing error handling: map server responses and network failures to sanitized explanations
      const rawMessage = err instanceof Error ? err.message : "";

      if (rawMessage.includes("already been submitted")) {
        setSubmitError({
          title: "Exam Already Submitted",
          message: "This exam session was already finalized. You can view your completed results.",
          canRetry: false,
        });
      } else if (rawMessage.includes("expired")) {
        setSubmitError({
          title: "Exam Session Expired",
          message: "The time limit allocated for this exam session has ended. Your answers can no longer be recorded.",
          canRetry: false,
        });
      } else if (rawMessage.includes("Invalid or expired") || rawMessage.includes("not found")) {
        setSubmitError({
          title: "Session Invalid",
          message: "This exam session is invalid or cannot be verified. Please start a new mock exam session.",
          canRetry: false,
        });
      } else if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSubmitError({
          title: "No Internet Connection",
          message: "You appear to be offline. Please restore your connection. Your selected answers remain saved in this window.",
          canRetry: true,
        });
      } else {
        // Generic sanitized message — avoids leaking sensitive technical details / SQL traces
        setSubmitError({
          title: "Submission Incomplete",
          message: "We encountered a temporary interruption while submitting your exam. Please tap retry to finish recording your results.",
          canRetry: true,
        });
      }
    }
  };

  // Subject tab filter
  const handleSubjectTab = (subject: string) => {
    const firstIdx = state.questions.findIndex((q) => q.subject === subject);
    if (firstIdx >= 0) dispatch({ type: "NAVIGATE_TO", index: firstIdx });
  };

  const questionsInCurrentSubject = state.questions.filter(
    (q) => q.subject === state.currentSubject
  );
  const localIndex = questionsInCurrentSubject.findIndex(
    (q) => q.id === currentQuestion?.id
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 gap-4">
          {/* Left: Exit Exam & Branding */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => dispatch({ type: "OPEN_EXIT_MODAL" })}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border/80 transition-all cursor-pointer active:scale-95"
              title="Exit and cancel exam simulation"
            >
              <span className="text-sm leading-none font-bold">✕</span>
              <span className="hidden sm:inline">Exit Exam</span>
            </button>
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-black">J</span>
            </div>
            <span className="font-extrabold text-sm text-foreground hidden md:block">
              JAMB Mock Exam
            </span>
          </div>

          {/* Center: Subject tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-center">
            {subjectTabs.map((subj) => {
              const answered = state.questions
                .filter((q) => q.subject === subj)
                .filter((q) => state.questionStatuses[q.id] === "answered").length;
              const total = state.questions.filter((q) => q.subject === subj).length;
              const isActive = state.currentSubject === subj;
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => handleSubjectTab(subj)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {subj.replace("Use of English", "English").replace("Mathematics", "Math")}
                  <span
                    className={`ml-1 text-[10px] font-black ${
                      isActive ? "text-blue-100" : "text-muted-foreground"
                    }`}
                  >
                    {answered}/{total}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Timer + Calculator + Submit */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Countdown */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm tabular-nums border ${
                isCritical
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse"
                  : isWarning
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                  : "bg-muted text-foreground border-border"
              }`}
            >
              <span>{isCritical ? "⚠️" : "⏱"}</span>
              <span>{formatTime(state.timeRemainingSeconds)}</span>
            </div>

            {/* Calculator toggle */}
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_CALCULATOR" })}
              title="Open calculator (BODMAS)"
              className="p-2 rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all cursor-pointer text-sm"
            >
              🧮
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={() => dispatch({ type: "OPEN_CONFIRM_SUBMIT" })}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
            >
              Submit
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* LEFT: Question Area */}
        <div className="space-y-5">
          {/* Question Header */}
          {currentQuestion ? (
            <>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">
                    {currentQuestion.subject}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-bold border border-border">
                    {currentQuestion.year} JAMB
                  </span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  Question {localIndex + 1} of {questionsInCurrentSubject.length}
                  <span className="text-foreground/40 ml-1">
                    ({state.currentIndex + 1}/{totalCount} total)
                  </span>
                </span>
              </div>

              {/* Question stem */}
              <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs">
                <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium whitespace-pre-wrap">
                  {currentQuestion.text}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = currentAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionClick(opt.id)}
                      className={`w-full text-left flex items-start gap-3.5 p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "border-blue-600 bg-blue-500/10 dark:bg-blue-500/15 shadow-md shadow-blue-500/10"
                          : "border-border/80 bg-card hover:border-blue-400/50 hover:bg-muted/40"
                      }`}
                    >
                      <span
                        className={`flex-none w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm border-2 transition-colors ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-border text-muted-foreground bg-muted"
                        }`}
                      >
                        {opt.id}
                      </span>
                      <span className="text-sm text-foreground leading-relaxed pt-0.5">
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={state.currentIndex === 0}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-bold hover:bg-muted/70 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  {state.currentIndex === totalCount - 1 ? (
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "OPEN_CONFIRM_SUBMIT" })}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-xs flex items-center gap-1.5"
                    >
                      <span>Review & Submit</span>
                      <span>📝</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
                    >
                      Next →
                    </button>
                  )}
                </div>

                {/* Guess flag */}
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() =>
                    currentQuestion &&
                    !isLocked &&
                    dispatch({ type: "TOGGLE_GUESSED", questionId: currentQuestion.id })
                  }
                  title="Mark as guessed — helps identify concepts to review and master later"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border disabled:opacity-50 disabled:cursor-not-allowed ${
                    currentIsGuessed
                      ? "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/40"
                      : "bg-muted text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  🎲
                  <span>{currentIsGuessed ? "Guessed ✓" : "Mark as Guessed"}</span>
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-card border border-border p-12 text-center text-muted-foreground">
              No questions loaded
            </div>
          )}
        </div>

        {/* RIGHT: Question Grid Sidebar */}
        <div className="space-y-4">
          {/* Progress */}
          <div className="rounded-2xl bg-card border border-border/80 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Overall Progress</span>
              <span className="font-black text-foreground tabular-nums">
                {answeredCount}/{totalCount}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all"
                style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {totalCount - answeredCount} questions remaining
            </div>
          </div>

          {/* Question Grid */}
          <div className="rounded-2xl bg-card border border-border/80 p-4 shadow-xs">
            <QuestionGrid subject={state.currentSubject} />
          </div>

          {/* Submit panel */}
          <button
            type="button"
            onClick={() => dispatch({ type: "OPEN_CONFIRM_SUBMIT" })}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-all cursor-pointer active:scale-[0.98] shadow-md shadow-emerald-600/20"
          >
            Submit Exam ({answeredCount}/{totalCount} answered)
          </button>
        </div>
      </div>

      {/* ── BOTTOM NAVIGATION GRID (mobile visible full grid) ── */}
      <div className="lg:hidden sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-3">
        <QuestionGrid />
      </div>

      {/* ── CALCULATOR MODAL ── */}
      {state.calculatorOpen && (
        <Calculator onClose={() => dispatch({ type: "TOGGLE_CALCULATOR" })} />
      )}

      {/* ── SUBMIT CONFIRMATION MODAL (Manual user submission only) ── */}
      {state.confirmSubmitOpen && !state.isTimedOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-lg font-black text-foreground">
                Submit Your Exam?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You have answered{" "}
                <strong className="text-foreground">{answeredCount}</strong> of{" "}
                <strong className="text-foreground">{totalCount}</strong>{" "}
                questions.{" "}
                {totalCount - answeredCount > 0 && (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {totalCount - answeredCount} question
                    {totalCount - answeredCount !== 1 ? "s" : ""} left unanswered.
                  </span>
                )}{" "}
                This action cannot be undone.
              </p>
              <div className="text-xs text-muted-foreground bg-muted rounded-xl p-3">
                ⏱ Time remaining:{" "}
                <span className="font-black text-foreground tabular-nums">
                  {formatTime(state.timeRemainingSeconds)}
                </span>
              </div>
            </div>

            {/* Error Banner (if submission failed) */}
            {submitError && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-left space-y-1"
              >
                <div className="flex items-center gap-1.5 text-destructive font-bold text-xs">
                  <span>⚠️</span>
                  <span>{submitError.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {submitError.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {submitError && !submitError.canRetry ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                {state.timeRemainingSeconds > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitError(null);
                      dispatch({ type: "CLOSE_CONFIRM_SUBMIT" });
                    }}
                    disabled={state.isSubmitting}
                    className="flex-1 py-2.5 rounded-xl bg-muted text-foreground text-sm font-bold hover:bg-muted/70 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Keep Going
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSubmitConfirmed}
                  disabled={state.isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {state.isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : submitError?.canRetry ? (
                    "Retry Submission"
                  ) : (
                    "Submit & View Results"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TIMEOUT AUTO-SUBMISSION OVERLAY (No verification modal on timeout) ── */}
      {state.isTimedOut && !state.isComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="text-4xl animate-bounce">⏱️</div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-foreground">
                Time is Up!
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your exam session time has ended. Your answers are being automatically submitted...
              </p>
            </div>

            {state.isSubmitting && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                Grading and recording results…
              </div>
            )}

            {submitError && (
              <div
                role="alert"
                className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-left space-y-1.5"
              >
                <div className="flex items-center gap-1.5 text-destructive font-bold text-xs">
                  <span>⚠️</span>
                  <span>{submitError.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {submitError.message}
                </p>
                {submitError.canRetry ? (
                  <button
                    type="button"
                    onClick={handleSubmitConfirmed}
                    className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Retry Submission
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/dashboard";
                    }}
                    className="w-full mt-2 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ── EXIT CONFIRMATION MODAL ── */}
      {state.exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto text-2xl font-black mb-1">
                ⚠️
              </div>
              <h2 className="text-lg font-black text-foreground">
                Exit Mock Exam?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to exit? Your exam simulation will be cancelled, and you will be returned to your dashboard.
              </p>
            </div>

            {/* Exam snapshot */}
            <div className="rounded-2xl bg-muted/60 border border-border/80 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered questions</span>
                <span className="font-bold text-foreground">
                  {answeredCount} of {totalCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Time remaining</span>
                <span className="font-bold tabular-nums text-foreground">
                  {formatTime(state.timeRemainingSeconds)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isExiting}
                onClick={() => dispatch({ type: "CLOSE_EXIT_MODAL" })}
                className="flex-1 py-2.5 rounded-xl bg-muted text-foreground text-xs sm:text-sm font-bold hover:bg-muted/70 transition-all cursor-pointer disabled:opacity-50"
              >
                Continue Exam
              </button>
              <button
                type="button"
                disabled={isExiting}
                onClick={handleConfirmExit}
                className="flex-1 py-2.5 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-70 flex items-center justify-center gap-1.5"
              >
                {isExiting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Exiting…
                  </>
                ) : (
                  "Yes, Exit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
