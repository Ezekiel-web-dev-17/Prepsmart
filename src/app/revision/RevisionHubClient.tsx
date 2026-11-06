"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGamification } from "@/components/gamification/XPToast";
import {
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  TargetIcon,
  SparklesIcon,
  CheckIcon,
  LightbulbIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  RefreshCwIcon,
  FlameIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
} from "@/components/ui/icons";
import {
  TopicRevisionGroup,
  TopicRevisionQuestion,
} from "@/lib/revision-generator";

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
  initialQuestions?: RevisionQuestion[];
  initialTotal?: number;
}

export default function RevisionHubClient({
  initialQuestions = [],
  initialTotal = 0,
}: RevisionHubClientProps) {
  const { triggerXPToast } = useGamification();

  // Mode: "topic-list" (Duolingo modules) | "drill" (3-question session)
  const [mode, setMode] = useState<"topic-list" | "drill">("topic-list");

  // Topic Groups state
  const [topicGroups, setTopicGroups] = useState<TopicRevisionGroup[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(true);
  const [totalFailedCount, setTotalFailedCount] = useState<number>(initialTotal);

  // Active Drill Session state
  const [activeTopic, setActiveTopic] = useState<TopicRevisionGroup | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctOption: string;
    explanation: string;
    mnemonic?: string | null;
    message: string;
  } | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<boolean[]>([]);
  const [isDrillCompleted, setIsDrillCompleted] = useState<boolean>(false);

  // Stats
  const [masteredTopicsCount, setMasteredTopicsCount] = useState<number>(0);

  // Load topic-organized revision on mount
  useEffect(() => {
    fetchTopicGroups();
  }, []);

  const fetchTopicGroups = async () => {
    setIsLoadingTopics(true);
    try {
      const res = await fetch("/api/mock-exam/revision?view=topics");
      if (res.ok) {
        const data = await res.json();
        setTopicGroups(data.topicGroups || []);
        setTotalFailedCount(data.totalFailedQuestions || 0);
      }
    } catch (err) {
      console.error("Error fetching revision topic groups:", err);
    } finally {
      setIsLoadingTopics(false);
    }
  };

  const handleStartTopicDrill = (group: TopicRevisionGroup) => {
    setActiveTopic(group);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setFeedback(null);
    setDrillAnswers([]);
    setIsDrillCompleted(false);
    setMode("drill");
  };

  const handleSelectOption = (optId: string) => {
    if (feedback) return; // locked once checked
    setSelectedOption(optId);
  };

  const handleConfirmAnswer = async () => {
    if (!activeTopic || !selectedOption || isSubmitting) return;

    const currentQ: TopicRevisionQuestion | undefined = activeTopic.questions[currentQIndex];
    if (!currentQ) return;

    setIsSubmitting(true);
    const isLastQuestion = currentQIndex === activeTopic.questions.length - 1;

    try {
      const res = await fetch("/api/mock-exam/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQ.id,
          selectedOption,
          failedRecordIds: activeTopic.failedRecordIds,
          isTopicCompleted: isLastQuestion,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to check answer");
      }

      const data = await res.json();
      setFeedback(data);
      const isCorrect = Boolean(data.isCorrect);
      setDrillAnswers((prev) => [...prev, isCorrect]);

      if (isCorrect) {
        triggerXPToast({
          points: 15,
          eventType: "QUESTION_ANSWERED",
          message: "Drill Question Mastered! +15 XP",
        });
      }

      if (isLastQuestion && isCorrect) {
        setIsDrillCompleted(true);
        setMasteredTopicsCount((prev) => prev + 1);
        setTotalFailedCount((prev) => Math.max(0, prev - activeTopic.failedCount));

        // Mark local group as mastered
        setTopicGroups((prev) =>
          prev.map((g) =>
            g.topic === activeTopic.topic && g.subject === activeTopic.subject
              ? { ...g, isMastered: true }
              : g
          )
        );

        triggerXPToast({
          points: 35,
          eventType: "TOPIC_COMPLETED",
          message: "Weak Topic Cleared! +35 XP Bonus",
        });
      }
    } catch (err) {
      console.error("Revision submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (!activeTopic) return;
    if (currentQIndex < activeTopic.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setFeedback(null);
    } else {
      setIsDrillCompleted(true);
    }
  };

  const handleReturnToTopicList = () => {
    setMode("topic-list");
    setActiveTopic(null);
    setFeedback(null);
    setSelectedOption(null);
  };

  // ── EMPTY STATE: All Caught Up! ──
  const unmasteredGroups = topicGroups.filter((g) => !g.isMastered);
  if (!isLoadingTopics && unmasteredGroups.length === 0 && topicGroups.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-amber-500/15 via-card to-emerald-500/10 border-2 border-amber-500/30 p-8 sm:p-12 shadow-xl space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-inner shadow-amber-500/20">
            <TrophyIcon className="w-10 h-10 text-amber-500" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-black border border-emerald-500/30">
              <span>ALL FAILED CONCEPTS RESOLVED</span>
              <span>•</span>
              <span>REVISION QUEUE 100% CLEAR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              You&apos;re All Caught Up!
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Every topic you&apos;ve previously struggled with is currently mastered. Your Readiness Index has received a maximum revision health boost!
            </p>

            {masteredTopicsCount > 0 && (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted/60 border border-border text-xs font-extrabold text-foreground">
                <SparklesIcon className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  You knocked out <span className="text-amber-500">{masteredTopicsCount}</span> weak topic{masteredTopicsCount === 1 ? "" : "s"} in this session!
                </span>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              href="/study/roadmap"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              <SparklesIcon className="w-4 h-4 text-amber-300" />
              <span>Continue Visual Roadmap</span>
            </Link>
            <Link
              href="/study?tab=mock-exam"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs border border-border transition-all flex items-center justify-center gap-2"
            >
              <span>Take Mock Exam</span>
              <ClockIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── DRILL VIEW: Focused 3-Question Duolingo-Style Revision ──
  if (mode === "drill" && activeTopic) {
    const currentQ = activeTopic.questions[currentQIndex];

    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Top Header: Progress Bar & Exit */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleReturnToTopicList}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Exit Drill"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>

          {/* Duolingo Segmented Progress Bar (3 questions) */}
          <div className="flex-1 flex items-center gap-2">
            {activeTopic.questions.map((_, idx) => {
              const isPassed = drillAnswers[idx] === true;
              const isCurrent = idx === currentQIndex;

              let barColor = "bg-muted";
              if (isPassed) barColor = "bg-emerald-500";
              else if (isCurrent) barColor = "bg-blue-500 animate-pulse";

              return (
                <div
                  key={idx}
                  className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${barColor}`}
                />
              );
            })}
          </div>

          <div className="text-xs font-black text-muted-foreground font-mono">
            {currentQIndex + 1}/3
          </div>
        </div>

        {/* Topic Title Bar */}
        <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {activeTopic.subject}
              </span>
              <span className="text-xs font-bold text-foreground">
                {activeTopic.topic}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Targeted 3-question drill • {currentQ?.isVariant ? "Similar Calculation Variant" : "Original Error Check"}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold flex items-center gap-1">
            <FlameIcon className="w-3.5 h-3.5" />
            <span>+15 XP</span>
          </span>
        </div>

        {/* Drill Completion Celebration Screen */}
        {isDrillCompleted ? (
          <div className="p-8 rounded-3xl bg-linear-to-b from-emerald-500/15 via-card to-emerald-500/5 border-2 border-emerald-500/30 text-center space-y-6 shadow-xl animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                TOPIC CONQUERED!
              </span>
              <h2 className="text-2xl font-black text-foreground">
                {activeTopic.topic} Mastered!
              </h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                You successfully solved the 3 targeted questions on this topic. All corresponding error flags have been cleared and your Readiness Index has received a boost!
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-black">
              <SparklesIcon className="w-4 h-4" />
              <span>+50 XP Total Awarded</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReturnToTopicList}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Back to Revision Hub
              </button>
            </div>
          </div>
        ) : (
          /* Question Interface */
          currentQ && (
            <div className="space-y-6">
              {/* Question Text */}
              <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
                <div className="text-sm font-bold text-foreground leading-relaxed">
                  {currentQ.text}
                </div>

                {/* Embedded Diagram if present */}
                {currentQ.diagramSvg && (
                  <div
                    className="p-3 rounded-xl bg-muted/40 border border-border flex items-center justify-center overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: currentQ.diagramSvg }}
                  />
                )}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  const isChecked = Boolean(feedback);
                  const isCorrect = feedback?.correctOption === opt.id;

                  let optionStyle = "border-border hover:bg-muted/60 text-foreground";
                  if (isSelected && !isChecked) {
                    optionStyle = "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/30";
                  } else if (isChecked) {
                    if (isCorrect) {
                      optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/30";
                    } else if (isSelected && !isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/30";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center gap-3.5 cursor-pointer shadow-xs ${optionStyle}`}
                    >
                      <span className="w-7 h-7 rounded-xl bg-muted text-foreground font-black text-xs flex items-center justify-center shrink-0">
                        {opt.id}
                      </span>
                      <span className="font-medium text-xs leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Duolingo Sliding Feedback Footer */}
              {feedback ? (
                <div
                  className={`p-5 rounded-2xl border space-y-3 transition-all animate-in slide-in-from-bottom-2 ${
                    feedback.isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      {feedback.isCorrect ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                          <span>Spot On! +15 XP</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangleIcon className="w-4 h-4 text-rose-500" />
                          <span>Correct Answer is Option {feedback.correctOption}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs font-medium leading-relaxed opacity-90">
                    {feedback.explanation}
                  </p>

                  {feedback.mnemonic && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
                      <SparklesIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{feedback.mnemonic}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{currentQIndex < activeTopic.questions.length - 1 ? "Next Drill Question" : "Complete Topic"}</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmAnswer}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCwIcon className="w-4 h-4 animate-spin" />
                      <span>Checking Answer...</span>
                    </>
                  ) : (
                    <span>Check Answer</span>
                  )}
                </button>
              )}
            </div>
          )
        )}
      </div>
    );
  }

  // ── TOPIC LIST VIEW: Duolingo-Style Revision Units ──
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-linear-to-r from-amber-500/15 via-orange-500/10 to-red-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
              DUOLINGO-STYLE REVISION
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              3 Questions Per Weak Topic
            </span>
          </div>
          <h2 className="text-lg font-black text-foreground tracking-tight">
            Targeted Error Revision Hub
          </h2>
          <p className="text-xs text-muted-foreground max-w-xl leading-relaxed font-medium">
            Instead of generic 20-question dumps, master each failed concept individually with 3 targeted questions (including isomorphic calculation variants). Clearing topics directly boosts your Readiness Index!
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <div className="text-center px-4 py-2.5 rounded-2xl bg-card border border-border">
            <div className="text-xl font-black text-amber-500">{topicGroups.filter((g) => !g.isMastered).length}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase">Topics To Master</div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoadingTopics && (
        <div className="p-12 text-center space-y-3">
          <RefreshCwIcon className="w-8 h-8 animate-spin mx-auto text-amber-500" />
          <p className="text-xs font-bold text-muted-foreground">
            Organizing your failed topics into 3-question drill sets...
          </p>
        </div>
      )}

      {/* Topic Units Grid */}
      {!isLoadingTopics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topicGroups.map((group, idx) => {
            const isMastered = group.isMastered;

            return (
              <div
                key={idx}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 relative ${
                  isMastered
                    ? "bg-emerald-500/5 border-emerald-500/30 opacity-70"
                    : "bg-card border-border hover:border-amber-500/60 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                      {group.subject}
                    </span>

                    {isMastered ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" />
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {group.failedCount} Error{group.failedCount === 1 ? "" : "s"} Flagged
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-foreground tracking-tight">
                    {group.topic}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-medium">
                    Core Concept: {group.concept}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
                    <TargetIcon className="w-3.5 h-3.5 text-blue-500" />
                    <span>3 Targeted Questions</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartTopicDrill(group)}
                    disabled={isMastered}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      isMastered
                        ? "bg-muted text-muted-foreground cursor-default"
                        : "bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold"
                    }`}
                  >
                    <span>{isMastered ? "Practiced" : "Practice Topic"}</span>
                    {!isMastered && <ArrowRightIcon className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
