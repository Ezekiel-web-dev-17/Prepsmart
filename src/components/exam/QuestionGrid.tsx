"use client";

import { useMemo } from "react";
import { useExam, type QuestionStatus } from "@/context/ExamContext";

// Status color map for the navigation grid
const statusColors: Record<QuestionStatus, string> = {
  unanswered: "bg-muted text-muted-foreground hover:bg-muted/70",
  viewed: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40 hover:bg-amber-500/30",
  answered: "bg-emerald-600 text-white hover:bg-emerald-700",
};

interface QuestionGridProps {
  subject?: string; // If provided, show only questions for this subject
}

export default function QuestionGrid({ subject }: QuestionGridProps) {
  const { state, dispatch } = useExam();

  const questions = useMemo(
    () =>
      subject
        ? state.questions.filter((q) => q.subject === subject)
        : state.questions,
    [state.questions, subject]
  );

  const { answeredCount, viewedCount, unansweredCount } = useMemo(() => {
    let answered = 0;
    let viewed = 0;
    let unanswered = 0;
    for (const q of questions) {
      const status = state.questionStatuses[q.id] ?? "unanswered";
      if (status === "answered") answered++;
      else if (status === "viewed") viewed++;
      else unanswered++;
    }
    return { answeredCount: answered, viewedCount: viewed, unansweredCount: unanswered };
  }, [questions, state.questionStatuses]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>Question Navigator</span>
        <span className="tabular-nums">
          <strong className="text-foreground">{answeredCount}</strong> of {questions.length} questions
        </span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] font-semibold pb-1">
        <span className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded bg-muted inline-block" />
          <span className="text-muted-foreground">Unanswered</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded bg-amber-500/30 inline-block" />
          <span className="text-muted-foreground">Viewed/Skipped</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block" />
          <span className="text-muted-foreground">Answered</span>
        </span>
      </div>

      {/* 10-column grid */}
      <div className="grid grid-cols-10 gap-1">
        {questions.map((q, localIdx) => {
          const globalIdx = state.questions.findIndex((gq) => gq.id === q.id);
          const status = state.questionStatuses[q.id] ?? "unanswered";
          const isCurrent = globalIdx === state.currentIndex;

          return (
            <button
              key={q.id}
              type="button"
              title={`Q${localIdx + 1}: ${q.topic} (${status})`}
              onClick={() => dispatch({ type: "NAVIGATE_TO", index: globalIdx })}
              className={`
                relative h-8 rounded-lg text-xs font-bold transition-all cursor-pointer
                ${statusColors[status]}
                ${isCurrent ? "ring-2 ring-blue-600 ring-offset-1 scale-110 z-10" : ""}
                ${state.guessedQuestions[q.id] ? "ring-1 ring-purple-500" : ""}
              `}
            >
              {localIdx + 1}
              {state.guessedQuestions[q.id] && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground font-medium">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
          {answeredCount} Answered
        </span>
        <span className="text-amber-600 dark:text-amber-400 font-bold">
          {viewedCount} Viewed
        </span>
        <span>
          {unansweredCount} Remaining
        </span>
      </div>
    </div>
  );
}
