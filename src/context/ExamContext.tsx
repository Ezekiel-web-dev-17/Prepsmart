/**
 * Secure Exam Context & State Machine
 *
 * Security architecture:
 * - Correct answers are NEVER stored in client state (they live server-side only)
 * - The sessionToken is the only client credential; it cannot be forged
 * - Timer sync uses server's expiresAt, not client-generated timestamps
 * - State mutations are driven by a strict useReducer dispatch contract
 * - localStorage persistence is limited to answered IDs (no answer values in prod)
 */
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ClientQuestion {
  id: string;
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  orderIndex: number;
  topic?: string;
  concept?: string;
  // NOTE: correctOption intentionally absent
}

export type QuestionStatus = "unanswered" | "viewed" | "answered";

export interface ExamState {
  // Session identity
  sessionToken: string;
  sessionId: string;
  selectedSubjects: string[];
  subjectMode: string;

  // Questions (no correct answers — stripped server-side)
  questions: ClientQuestion[];

  // Navigation
  currentIndex: number;
  currentSubject: string;

  // Answer state — opaque string per question
  answers: Record<string, string>;
  questionStatuses: Record<string, QuestionStatus>;
  guessedQuestions: Record<string, boolean>;

  // Timer state — derived from server expiresAt
  expiresAt: number; // Unix ms from server
  timeRemainingSeconds: number;
  isTimerRunning: boolean;
  isTimedOut: boolean;

  // UI state
  calculatorOpen: boolean;
  confirmSubmitOpen: boolean;
  exitModalOpen: boolean;
  isSubmitting: boolean;
  isComplete: boolean;
  attemptId: string | null;
}

export type ExamAction =
  | { type: "SELECT_OPTION"; questionId: string; option: string }
  | { type: "DESELECT_OPTION"; questionId: string }
  | { type: "NAVIGATE_TO"; index: number }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "MARK_AS_VIEWED"; questionId: string }
  | { type: "TOGGLE_GUESSED"; questionId: string }
  | { type: "TICK_TIMER" }
  | { type: "TIMER_EXPIRED" }
  | { type: "TOGGLE_CALCULATOR" }
  | { type: "OPEN_CONFIRM_SUBMIT" }
  | { type: "CLOSE_CONFIRM_SUBMIT" }
  | { type: "OPEN_EXIT_MODAL" }
  | { type: "CLOSE_EXIT_MODAL" }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SET_COMPLETE"; attemptId: string };

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "SELECT_OPTION": {
      const current = state.answers[action.questionId];
      // Click same option again = deselect
      if (current === action.option) {
        const { [action.questionId]: _, ...remaining } = state.answers;
        return {
          ...state,
          answers: remaining,
          questionStatuses: {
            ...state.questionStatuses,
            [action.questionId]: "viewed",
          },
        };
      }
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.option },
        questionStatuses: {
          ...state.questionStatuses,
          [action.questionId]: "answered",
        },
      };
    }

    case "DESELECT_OPTION": {
      const { [action.questionId]: _, ...remaining } = state.answers;
      return {
        ...state,
        answers: remaining,
        questionStatuses: {
          ...state.questionStatuses,
          [action.questionId]: "viewed",
        },
      };
    }

    case "NAVIGATE_TO": {
      const q = state.questions[action.index];
      if (!q) return state;
      const currentStatus = state.questionStatuses[q.id];
      return {
        ...state,
        currentIndex: action.index,
        currentSubject: q.subject,
        questionStatuses:
          !currentStatus || currentStatus === "unanswered"
            ? { ...state.questionStatuses, [q.id]: "viewed" }
            : state.questionStatuses,
      };
    }

    case "NEXT_QUESTION": {
      if (state.currentIndex >= state.questions.length - 1) return state;
      const nextIdx = state.currentIndex + 1;
      const nextQ = state.questions[nextIdx];
      if (!nextQ) return state;
      const currentStatus = state.questionStatuses[nextQ.id];
      return {
        ...state,
        currentIndex: nextIdx,
        currentSubject: nextQ.subject,
        questionStatuses:
          !currentStatus || currentStatus === "unanswered"
            ? { ...state.questionStatuses, [nextQ.id]: "viewed" }
            : state.questionStatuses,
      };
    }

    case "PREV_QUESTION": {
      if (state.currentIndex <= 0) return state;
      const prevIdx = state.currentIndex - 1;
      const prevQ = state.questions[prevIdx];
      if (!prevQ) return state;
      const currentStatus = state.questionStatuses[prevQ.id];
      return {
        ...state,
        currentIndex: prevIdx,
        currentSubject: prevQ.subject,
        questionStatuses:
          !currentStatus || currentStatus === "unanswered"
            ? { ...state.questionStatuses, [prevQ.id]: "viewed" }
            : state.questionStatuses,
      };
    }

    case "MARK_AS_VIEWED": {
      const existing = state.questionStatuses[action.questionId];
      if (existing && existing !== "unanswered") return state;
      return {
        ...state,
        questionStatuses: {
          ...state.questionStatuses,
          [action.questionId]: "viewed",
        },
      };
    }

    case "TOGGLE_GUESSED":
      return {
        ...state,
        guessedQuestions: {
          ...state.guessedQuestions,
          [action.questionId]: !state.guessedQuestions[action.questionId],
        },
      };

    case "TICK_TIMER": {
      const remaining = Math.max(
        0,
        Math.floor((state.expiresAt - Date.now()) / 1000)
      );
      return {
        ...state,
        timeRemainingSeconds: remaining,
        isTimerRunning: remaining > 0,
      };
    }

    case "TIMER_EXPIRED":
      return {
        ...state,
        timeRemainingSeconds: 0,
        isTimerRunning: false,
        confirmSubmitOpen: false, // Ensure verification modal is closed on timeout
        isTimedOut: true,
      };

    case "TOGGLE_CALCULATOR":
      return { ...state, calculatorOpen: !state.calculatorOpen };

    case "OPEN_CONFIRM_SUBMIT":
      // Block opening verification modal if timed out, already complete, or 0 time left
      if (state.isTimedOut || state.isComplete || state.timeRemainingSeconds <= 0) {
        return state;
      }
      return { ...state, confirmSubmitOpen: true };

    case "CLOSE_CONFIRM_SUBMIT":
      return { ...state, confirmSubmitOpen: false };

    case "OPEN_EXIT_MODAL":
      return { ...state, exitModalOpen: true };

    case "CLOSE_EXIT_MODAL":
      return { ...state, exitModalOpen: false };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };

    case "SET_COMPLETE":
      return {
        ...state,
        isComplete: true,
        isSubmitting: false,
        confirmSubmitOpen: false,
        attemptId: action.attemptId,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

interface ExamContextValue {
  state: ExamState;
  dispatch: React.Dispatch<ExamAction>;
  submitExam: () => Promise<void>;
  cancelExam: () => Promise<void>;
  answeredCount: number;
  viewedCount: number;
  totalCount: number;
  questionsForSubject: (subject: string) => ClientQuestion[];
  currentQuestion: ClientQuestion | undefined;
}

const ExamContext = createContext<ExamContextValue | null>(null);

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be used inside <ExamProvider>");
  return ctx;
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

interface ExamProviderProps {
  children: React.ReactNode;
  initialData: {
    sessionId: string;
    sessionToken: string;
    selectedSubjects: string[];
    subjectMode: string;
    durationSeconds: number;
    expiresAt: string; // ISO
    questions: ClientQuestion[];
  };
  onComplete: (attemptId: string) => void;
}

const initialStatuses = (
  questions: ClientQuestion[]
): Record<string, QuestionStatus> =>
  Object.fromEntries(questions.map((q) => [q.id, "unanswered" as const]));

export function ExamProvider({
  children,
  initialData,
  onComplete,
}: ExamProviderProps) {
  const expiresAtMs = new Date(initialData.expiresAt).getTime();
  const startedAtMs = useRef(Date.now());

  const initialRemaining = Math.max(
    0,
    Math.floor((expiresAtMs - Date.now()) / 1000)
  );

  const [state, dispatch] = useReducer(examReducer, {
    sessionToken: initialData.sessionToken,
    sessionId: initialData.sessionId,
    selectedSubjects: initialData.selectedSubjects,
    subjectMode: initialData.subjectMode,
    questions: initialData.questions,
    currentIndex: 0,
    currentSubject: initialData.questions[0]?.subject ?? "",
    answers: {},
    questionStatuses: initialStatuses(initialData.questions),
    guessedQuestions: {},
    expiresAt: expiresAtMs,
    timeRemainingSeconds: initialRemaining,
    isTimerRunning: initialRemaining > 0,
    isTimedOut: initialRemaining <= 0,
    calculatorOpen: false,
    confirmSubmitOpen: false,
    exitModalOpen: false,
    isSubmitting: false,
    isComplete: false,
    attemptId: null,
  });

  // Keep a reference to latest state for async callbacks & timer
  const stateRef = useRef(state);
  stateRef.current = state;

  // Mark initial question as viewed
  useEffect(() => {
    const q = initialData.questions[0];
    if (q) dispatch({ type: "MARK_AS_VIEWED", questionId: q.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Secure exam submission — all scoring happens server-side
  const submitExam = useCallback(async () => {
    const current = stateRef.current;
    if (current.isSubmitting || current.isComplete) return;
    dispatch({ type: "SET_SUBMITTING", value: true });

    const timeSpentSeconds = Math.min(
      Math.floor((Date.now() - startedAtMs.current) / 1000),
      initialData.durationSeconds
    );

    try {
      const res = await fetch("/api/mock-exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken: current.sessionToken,
          answers: current.answers,
          guessedQuestions: Object.entries(current.guessedQuestions)
            .filter(([, v]) => v)
            .map(([k]) => k),
          timeSpentSeconds,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error ?? "Submission failed");
      }

      const result = await res.json();
      dispatch({ type: "SET_COMPLETE", attemptId: result.attemptId });
      onComplete(result.attemptId);
    } catch (err) {
      dispatch({ type: "SET_SUBMITTING", value: false });
      throw err;
    }
  }, [initialData.durationSeconds, onComplete]);

  const cancelExam = useCallback(async () => {
    try {
      await fetch("/api/mock-exam/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionToken: stateRef.current.sessionToken }),
      });
    } catch (err) {
      console.warn("Failed to notify server of cancellation:", err);
    }
  }, []);

  // Ticking timer — synced to server expiresAt; auto-submits on timeout without verification modal
  useEffect(() => {
    if (!state.isTimerRunning || state.isComplete) return;

    // Immediate check if already expired
    const currentRemaining = Math.max(
      0,
      Math.floor((expiresAtMs - Date.now()) / 1000)
    );
    if (currentRemaining <= 0) {
      dispatch({ type: "TIMER_EXPIRED" });
      submitExam().catch((err) => {
        console.error("Auto-submit on timeout failed:", err);
      });
      return;
    }

    const id = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAtMs - Date.now()) / 1000)
      );
      if (remaining <= 0) {
        dispatch({ type: "TIMER_EXPIRED" });
        clearInterval(id);
        // Automatically submit for the candidate without verification modal
        submitExam().catch((err) => {
          console.error("Auto-submit on timeout failed:", err);
        });
      } else {
        dispatch({ type: "TICK_TIMER" });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [state.isTimerRunning, state.isComplete, expiresAtMs, submitExam]);

  // Derived memoized values
  const answeredCount = useMemo(
    () => Object.values(state.questionStatuses).filter((s) => s === "answered").length,
    [state.questionStatuses]
  );
  const viewedCount = useMemo(
    () => Object.values(state.questionStatuses).filter((s) => s === "viewed").length,
    [state.questionStatuses]
  );
  const totalCount = state.questions.length;

  const questionsForSubject = useCallback(
    (subject: string) => state.questions.filter((q) => q.subject === subject),
    [state.questions]
  );

  const currentQuestion = state.questions[state.currentIndex];

  return (
    <ExamContext.Provider
      value={{
        state,
        dispatch,
        submitExam,
        cancelExam,
        answeredCount,
        viewedCount,
        totalCount,
        questionsForSubject,
        currentQuestion,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}
