"use client";

import React, { useState, useEffect } from "react";
import { RoadmapTopicNode } from "@/lib/roadmap-curriculum";
import {
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  FlameIcon,
  BrainIcon,
  XIcon,
  TrophyIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  CheckIcon,
} from "@/components/ui/icons";

interface OptionItem {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  subject: string;
  year: number;
  text: string;
  options: OptionItem[];
  correctOption: string;
  topic: string;
  concept: string;
  explanation: string;
  mnemonic?: string | null;
  diagramSvg?: string | null;
  difficulty?: string;
}

interface AiReviewData {
  score: number;
  passed: boolean;
  summary: string;
  strengths: string[];
  missingConcepts: string[];
  textbookTip: string;
  evaluatedBy: "gemini" | "heuristic";
}

export interface TopicProgressState {
  id?: string;
  subject: string;
  stream: string;
  topicSlug: string;
  topicTitle: string;
  studentNote?: string | null;
  aiFeedback?: string | null;
  aiScore?: number | null;
  quizScore?: number | null;
  quizTotal?: number | null;
  isCompleted: boolean;
  completedAt?: string | null;
}

interface TopicMasteryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  topic: RoadmapTopicNode | null;
  progress?: TopicProgressState | null;
  onTopicCompleted?: (topicSlug: string, newTotalXp?: number) => void;
}

export default function TopicMasteryDrawer({
  isOpen,
  onClose,
  topic,
  progress,
  onTopicCompleted,
}: TopicMasteryDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "feynman" | "quiz">("overview");

  // Feynman Note state
  const [studentNote, setStudentNote] = useState<string>("");
  const [isEvaluatingNote, setIsEvaluatingNote] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<AiReviewData | null>(null);

  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState<boolean>(false);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Completion state
  const [isMarkingComplete, setIsMarkingComplete] = useState<boolean>(false);
  const [isTopicCompleted, setIsTopicCompleted] = useState<boolean>(false);
  const [awardedXp, setAwardedXp] = useState<number | null>(null);

  // Sync state when topic or progress changes
  useEffect(() => {
    if (!topic) return;

    setActiveTab("overview");
    setStudentNote(progress?.studentNote || "");
    setIsTopicCompleted(Boolean(progress?.isCompleted));
    setAwardedXp(null);
    setIsQuizSubmitted(false);
    setUserAnswers({});
    setCurrentQIndex(0);

    if (progress?.aiScore !== undefined && progress?.aiScore !== null) {
      setAiReview({
        score: progress.aiScore,
        passed: progress.aiScore >= 60,
        summary: progress.aiFeedback || "Previously evaluated study note.",
        strengths: ["Demonstrated foundational grasp."],
        missingConcepts: [],
        textbookTip: "Review chapter exercises in recommended text.",
        evaluatedBy: "heuristic",
      });
    } else {
      setAiReview(null);
    }

    if (progress?.quizScore !== undefined && progress?.quizScore !== null) {
      setQuizScore(progress.quizScore);
    } else {
      setQuizScore(null);
    }
  }, [topic, progress]);

  // Fetch Quiz questions when quiz tab is opened
  useEffect(() => {
    if (activeTab === "quiz" && topic && questions.length === 0) {
      fetchQuizQuestions();
    }
  }, [activeTab, topic]);

  if (!isOpen || !topic) return null;

  const fetchQuizQuestions = async () => {
    setIsLoadingQuiz(true);
    try {
      const res = await fetch(
        `/api/study/topic-quiz?subject=${encodeURIComponent(topic.subject)}&topic=${encodeURIComponent(
          topic.drillTopic
        )}&limit=8`
      );
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error("Error fetching quiz questions:", err);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleEvaluateNote = async () => {
    if (!studentNote.trim() || studentNote.trim().split(/\s+/).length < 10) {
      alert("Please write at least 15 words explaining the concept in your own words before requesting AI evaluation.");
      return;
    }

    setIsEvaluatingNote(true);
    try {
      const res = await fetch("/api/ai/review-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic.subject,
          topicSlug: topic.id,
          topicTitle: topic.title,
          studentNote,
          syllabusOutlines: topic.syllabusOutlines,
          textbookAdvice: topic.textbookAdvice,
        }),
      });

      if (res.ok) {
        const data: AiReviewData = await res.json();
        setAiReview(data);

        // Auto-save progress to DB or localStorage
        await fetch("/api/study/topic-progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: topic.subject,
            stream: topic.stream,
            topicSlug: topic.id,
            topicTitle: topic.title,
            studentNote,
            aiFeedback: data.summary,
            aiScore: data.score,
          }),
        });
      }
    } catch (err) {
      console.error("Error evaluating note:", err);
    } finally {
      setIsEvaluatingNote(false);
    }
  };

  const handleSelectOption = (questionId: string, optionLetter: string) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionLetter }));
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOption) {
        score++;
      }
    });

    setQuizScore(score);
    setIsQuizSubmitted(true);

    try {
      await fetch("/api/study/topic-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic.subject,
          stream: topic.stream,
          topicSlug: topic.id,
          topicTitle: topic.title,
          quizScore: score,
          quizTotal: questions.length,
        }),
      });
    } catch (err) {
      console.error("Error saving quiz score:", err);
    }
  };

  const handleCompleteTopic = async () => {
    setIsMarkingComplete(true);
    try {
      const res = await fetch("/api/study/topic-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: topic.subject,
          stream: topic.stream,
          topicSlug: topic.id,
          topicTitle: topic.title,
          studentNote,
          aiFeedback: aiReview?.summary || null,
          aiScore: aiReview?.score || null,
          quizScore: quizScore || null,
          quizTotal: questions.length || null,
          isCompleted: true,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsTopicCompleted(true);
        setAwardedXp(50);
        if (onTopicCompleted) {
          onTopicCompleted(topic.id, data.xpResult?.newTotalXp);
        }
      }
    } catch (err) {
      console.error("Error marking topic complete:", err);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const feynmanPassed = (aiReview?.score ?? 0) >= 60;
  const quizPassed = questions.length > 0 && quizScore !== null ? (quizScore / questions.length) >= 0.6 : (quizScore !== null && quizScore >= 3);
  const canMarkComplete = isTopicCompleted || (feynmanPassed && quizPassed);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border-l border-border h-full flex flex-col shadow-2xl relative text-foreground">
        {/* Header */}
        <div className="p-5 border-b border-border/80 flex items-start justify-between gap-4 bg-muted/20">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase bg-primary/10 text-primary border border-primary/20">
                {topic.stageTitle}
              </span>
              {topic.highYield && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <FlameIcon className="w-3 h-3" />
                  <span>High Yield (≥4 Qs)</span>
                </span>
              )}
              {topic.examinerTrap && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                  <AlertTriangleIcon className="w-3 h-3" />
                  <span>Examiner Trap</span>
                </span>
              )}
              {isTopicCompleted && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircleIcon className="w-3.5 h-3.5" />
                  <span>Mastered (+50 XP)</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">{topic.title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{topic.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 border-b border-border flex items-center gap-2 bg-card">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpenIcon className="w-4 h-4" />
            <span>1. Syllabus & Blueprint</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("feynman")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === "feynman"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BrainIcon className="w-4 h-4" />
            <span>2. Feynman Note & AI Review</span>
            {feynmanPassed && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quiz")}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === "quiz"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>3. Topic CBT Test</span>
            {quizPassed && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: OVERVIEW & BLUEPRINT */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Examiner Trap Warning Alert */}
              {topic.trapAlert && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangleIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      UTME Examiner Trap Warning
                    </span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed">{topic.trapAlert}</p>
                </div>
              )}

              {/* Conceptual Deep Dive */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <LightbulbIcon className="w-4 h-4 text-amber-500" />
                  <span>Core Concept Deep Dive</span>
                </h3>
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-foreground text-xs leading-relaxed font-normal">
                  {topic.conceptDeepDive}
                </div>
              </div>

              {/* Key Formulas or Rules */}
              {topic.keyFormulasOrRules.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Key Formulas & Governing Rules
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topic.keyFormulasOrRules.map((formula, idx) => (
                      <div
                        key={idx}
                        className="px-3.5 py-2.5 rounded-xl bg-card border border-border font-mono text-xs font-semibold text-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span>{formula}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Official Syllabus Objectives */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4 text-blue-500" />
                  <span>Official JAMB Syllabus Objectives</span>
                </h3>
                <ul className="space-y-2">
                  {topic.syllabusOutlines.map((obj, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-card border border-border/70 flex items-start gap-2.5 text-xs text-foreground/90 font-medium"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Nigerian Textbooks */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4 text-purple-500" />
                  <span>Recommended Nigerian Secondary Textbooks</span>
                </h3>
                <div className="space-y-2.5">
                  {topic.textbookAdvice.map((textbook, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs"
                    >
                      <div className="font-extrabold text-foreground flex items-center justify-between">
                        <span>{textbook.textbook}</span>
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md bg-purple-500/10">
                          {textbook.chapters}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1 font-medium">{textbook.focusNote}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Memory Mnemonics */}
              {topic.sampleMnemonics && topic.sampleMnemonics.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-amber-500" />
                    <span>Memory Mnemonics</span>
                  </h3>
                  <div className="space-y-2">
                    {topic.sampleMnemonics.map((mn, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-2"
                      >
                        <SparklesIcon className="w-4 h-4 shrink-0 text-amber-500" />
                        <span>{mn}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEYNMAN NOTE & AI REVIEW */}
          {activeTab === "feynman" && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                <div className="flex items-center gap-2 font-black uppercase tracking-wider mb-1">
                  <BrainIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>The Feynman Technique Rule</span>
                </div>
                To master this topic, explain its core principles in simple words as if teaching someone who has never heard of it. Our AI tutor will evaluate your explanation for conceptual clarity and syllabus accuracy. A score of <strong>≥ 60%</strong> is required.
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                  <label htmlFor="studentNoteInput">Your Feynman Summary Note:</label>
                  <span>{studentNote.trim().split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  id="studentNoteInput"
                  rows={6}
                  value={studentNote}
                  onChange={(e) => setStudentNote(e.target.value)}
                  placeholder="Explain what happens in this topic, key laws, and how to avoid mistakes... (e.g. When light passes into glass, its speed slows down...)"
                  className="w-full p-4 rounded-2xl bg-card border border-border text-foreground text-xs leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                />
              </div>

              <button
                type="button"
                onClick={handleEvaluateNote}
                disabled={isEvaluatingNote}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isEvaluatingNote ? (
                  <>
                    <RefreshCwIcon className="w-4 h-4 animate-spin" />
                    <span>AI Tutor is Evaluating Your Note...</span>
                  </>
                ) : (
                  <>
                    <BrainIcon className="w-4 h-4" />
                    <span>Submit Note for AI Review</span>
                  </>
                )}
              </button>

              {/* AI Review Results Card */}
              {aiReview && (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                      aiReview.passed
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider">
                        {aiReview.passed ? "Feynman Gate Cleared!" : "Needs More Detail"}
                      </div>
                      <p className="text-xs font-semibold mt-0.5">{aiReview.summary}</p>
                    </div>
                    <div className="shrink-0 text-center">
                      <div className="text-2xl font-black">{aiReview.score}%</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                        AI Score
                      </div>
                    </div>
                  </div>

                  {aiReview.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-muted-foreground">What You Understood Well:</h4>
                      <ul className="space-y-1">
                        {aiReview.strengths.map((str, idx) => (
                          <li
                            key={idx}
                            className="p-2.5 rounded-xl bg-card border border-border text-xs flex items-center gap-2 text-foreground font-medium"
                          >
                            <CheckIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiReview.missingConcepts.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-muted-foreground">Key Ideas to Reinforce:</h4>
                      <ul className="space-y-1">
                        {aiReview.missingConcepts.map((mis, idx) => (
                          <li
                            key={idx}
                            className="p-2.5 rounded-xl bg-card border border-border text-xs flex items-center gap-2 text-foreground font-medium"
                          >
                            <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{mis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20 text-xs text-foreground">
                    <span className="font-extrabold text-purple-600 dark:text-purple-400">
                      Textbook Recommendation:{" "}
                    </span>
                    <span className="font-medium text-muted-foreground">{aiReview.textbookTip}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOPIC CBT TEST */}
          {activeTab === "quiz" && (
            <div className="space-y-5">
              {isLoadingQuiz && (
                <div className="p-8 text-center space-y-3">
                  <RefreshCwIcon className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                  <p className="text-xs font-bold text-muted-foreground">
                    Loading authentic real-world JAMB questions for {topic.title}...
                  </p>
                </div>
              )}

              {!isLoadingQuiz && questions.length === 0 && (
                <div className="p-8 text-center space-y-3 bg-muted/20 rounded-2xl border border-border">
                  <p className="text-xs text-muted-foreground">No questions found for this topic drill.</p>
                  <button
                    type="button"
                    onClick={fetchQuizQuestions}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 text-white"
                  >
                    Retry Loading
                  </button>
                </div>
              )}

              {!isLoadingQuiz && questions.length > 0 && (
                <div className="space-y-5">
                  {/* Quiz Progress & Question Tracker */}
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-muted-foreground">
                      Question {currentQIndex + 1} of {questions.length}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black">
                      JAMB {questions[currentQIndex]?.year}
                    </span>
                  </div>

                  {/* Question Card */}
                  <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
                    <div className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                      {questions[currentQIndex]?.text}
                    </div>

                    {/* Embedded SVG Diagram if present */}
                    {questions[currentQIndex]?.diagramSvg && (
                      <div
                        className="my-3 p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-center overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: questions[currentQIndex].diagramSvg! }}
                      />
                    )}

                    {/* Options */}
                    <div className="space-y-2 pt-2">
                      {questions[currentQIndex]?.options.map((opt) => {
                        const isSelected = userAnswers[questions[currentQIndex].id] === opt.id;
                        const isCorrect = questions[currentQIndex].correctOption === opt.id;

                        let optionStyle = "border-border hover:bg-muted/60 text-foreground";
                        if (isSelected && !isQuizSubmitted) {
                          optionStyle = "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold";
                        } else if (isQuizSubmitted) {
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold";
                          } else if (isSelected && !isCorrect) {
                            optionStyle = "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400";
                          }
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectOption(questions[currentQIndex].id, opt.id)}
                            className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center gap-3 cursor-pointer ${optionStyle}`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-muted text-foreground font-black text-xs flex items-center justify-center shrink-0">
                              {opt.id}
                            </span>
                            <span className="font-medium">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation, Mnemonic & Corrections if submitted */}
                    {isQuizSubmitted && (
                      <div className="mt-4 pt-4 border-t border-border space-y-3">
                        <div className="text-xs font-medium text-foreground p-3.5 rounded-xl bg-muted/50 border border-border">
                          <strong className="text-blue-600 dark:text-blue-400 block mb-1">
                            Examiner Solution:
                          </strong>
                          {questions[currentQIndex]?.explanation}
                        </div>

                        {questions[currentQIndex]?.mnemonic && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center gap-2">
                            <SparklesIcon className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Mnemonic: {questions[currentQIndex].mnemonic}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 disabled:opacity-40 text-foreground transition-all cursor-pointer"
                    >
                      Previous
                    </button>

                    {currentQIndex < questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer"
                      >
                        Next
                      </button>
                    ) : !isQuizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md"
                      >
                        Submit Test
                      </button>
                    ) : (
                      <div className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                        Score: {quizScore} / {questions.length} (
                        {Math.round(((quizScore || 0) / questions.length) * 100)}%)
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer / Mastery Gate Unlock */}
        <div className="p-5 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            {isTopicCompleted ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4" />
                <span>Topic Mastered (+50 XP Earned)</span>
              </span>
            ) : canMarkComplete ? (
              <span className="text-blue-600 dark:text-blue-400 font-extrabold flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4" />
                <span>All Requirements Met! Ready to Master.</span>
              </span>
            ) : (
              <span className="text-muted-foreground font-medium">
                Requirements: Note score ≥ 60% & Quiz score ≥ 60%
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCompleteTopic}
            disabled={!canMarkComplete || isTopicCompleted || isMarkingComplete}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isTopicCompleted
                ? "bg-emerald-600 text-white opacity-90 cursor-default"
                : canMarkComplete
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
            }`}
          >
            {isMarkingComplete ? (
              <>
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
                <span>Unlocking Topic Mastery...</span>
              </>
            ) : isTopicCompleted ? (
              <>
                <CheckIcon className="w-4 h-4" />
                <span>Topic Completed</span>
              </>
            ) : (
              <>
                <TrophyIcon className="w-4 h-4" />
                <span>Mark Topic as Mastered (+50 XP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
