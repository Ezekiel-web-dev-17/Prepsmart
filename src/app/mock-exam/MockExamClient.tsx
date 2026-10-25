"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExamProvider } from "@/context/ExamContext";
import ExamShell from "@/components/exam/ExamShell";
import type { ExamSessionClientData } from "@/lib/exam";

const ALL_AVAILABLE_SUBJECTS = [
  "Use of English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Literature",
  "Government",
  "Geography",
  "Commerce",
];

const ACTIVE_QUESTION_BANK_SUBJECTS = new Set([
  "Use of English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
]);

interface MockExamClientProps {
  userSubjects: string[];
}

export default function MockExamClient({ userSubjects }: MockExamClientProps) {
  const router = useRouter();
  const [examSession, setExamSession] = useState<ExamSessionClientData | null>(null);

  // Initialize with up to 4 subjects from user's profile or defaults (only active ones)
  const initialSubjects = Array.from(
    new Set([
      ...userSubjects.filter((s) => ACTIVE_QUESTION_BANK_SUBJECTS.has(s)),
      "Use of English",
      "Mathematics",
      "Physics",
      "Chemistry",
    ])
  ).slice(0, 4);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubjects);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleSubject = (subject: string) => {
    setErrorMessage(null);
    if (!ACTIVE_QUESTION_BANK_SUBJECTS.has(subject)) {
      setErrorMessage(`The question bank for ${subject} is currently being curated. Please select from English, Mathematics, Physics, Chemistry, Biology, or Economics.`);
      return;
    }

    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length <= 1) {
        setErrorMessage("You must select at least 1 subject.");
        return;
      }
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      if (selectedSubjects.length >= 4) {
        setErrorMessage("You can select a maximum of 4 subjects.");
        return;
      }
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const setPresetCount = (targetCount: number) => {
    setErrorMessage(null);
    const activeCandidates = Array.from(ACTIVE_QUESTION_BANK_SUBJECTS);
    if (targetCount === 1) {
      setSelectedSubjects([selectedSubjects[0] || "Use of English"]);
    } else if (targetCount <= selectedSubjects.length) {
      setSelectedSubjects(selectedSubjects.slice(0, targetCount));
    } else {
      const candidates = activeCandidates.filter((s) => !selectedSubjects.includes(s));
      const needed = targetCount - selectedSubjects.length;
      setSelectedSubjects([...selectedSubjects, ...candidates.slice(0, needed)]);
    }
  };

  const handleStartExam = async () => {
    if (selectedSubjects.length < 1 || selectedSubjects.length > 4) {
      setErrorMessage("Please select between 1 and 4 subjects.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const mode =
      selectedSubjects.length === 4
        ? "four_subjects"
        : selectedSubjects.length === 1
        ? "single_subject"
        : `${selectedSubjects.length}_subjects`;

    try {
      const res = await fetch("/api/mock-exam/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectMode: mode,
          selectedSubjects,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unable to start exam session" }));
        throw new Error(data.error || "Unable to start exam session. Please try again.");
      }

      const data: ExamSessionClientData = await res.json();
      setExamSession(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error creating exam session";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  // If exam session is active, mount Provider and Shell
  if (examSession) {
    return (
      <ExamProvider
        initialData={examSession}
        onComplete={(attemptId) => {
          router.push(`/mock-exam/results/${attemptId}`);
        }}
      >
        <ExamShell
          onSubmitSuccess={(attemptId) => {
            router.push(`/mock-exam/results/${attemptId}`);
          }}
        />
      </ExamProvider>
    );
  }

  const durationMins = selectedSubjects.length * 30;
  const questionCount = selectedSubjects.length * 40;
  const xpReward = selectedSubjects.length === 4 ? 150 : selectedSubjects.length * 35;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black border border-blue-500/20">
          <span>JAMB CBT SIMULATOR</span>
          <span>•</span>
          <span>SELECT 1 TO 4 SUBJECTS</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          JAMB Mock Exam Simulation
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Configure your mock exam with any combination of <strong>1 to 4 subjects</strong>. Each subject includes 40 authentic questions with 30 minutes of calibrated exam time.
        </p>
      </div>

      {/* Live Configuration Stats Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums block">
            {selectedSubjects.length} / 4
          </span>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">
            Subjects Chosen
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
          <span className="text-2xl font-black text-amber-500 tabular-nums block">
            {durationMins} Mins
          </span>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">
            Duration
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums block">
            {questionCount}
          </span>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">
            Total Questions
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 text-center shadow-xs">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums block">
            +{xpReward} XP
          </span>
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mt-1">
            Completion Reward
          </span>
        </div>
      </div>

      {/* Quick Count Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Quick Subject Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { count: 1, label: "1 Subject (30m Sprint)" },
            { count: 2, label: "2 Subjects (60m Double)" },
            { count: 3, label: "3 Subjects (90m Triad)" },
            { count: 4, label: "4 Subjects (Full 120m UTME)" },
          ].map((preset) => (
            <button
              key={preset.count}
              type="button"
              onClick={() => setPresetCount(preset.count)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedSubjects.length === preset.count
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-muted/60 text-muted-foreground border-border hover:text-foreground hover:bg-muted"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Picker (1 to 4 subjects) */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-extrabold text-foreground">
              Select Your Subjects (1 to 4)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click any subject to toggle it. You can choose any single subject up to a full combination of 4.
            </p>
          </div>
          <span
            className={`text-xs font-black px-3 py-1 rounded-full border ${
              selectedSubjects.length === 4
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                : selectedSubjects.length > 0
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
            }`}
          >
            {selectedSubjects.length} of 4 selected
          </span>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {ALL_AVAILABLE_SUBJECTS.map((subj) => {
            const isSelected = selectedSubjects.includes(subj);
            const badgeNumber = selectedSubjects.indexOf(subj) + 1;
            const isAvailable = ACTIVE_QUESTION_BANK_SUBJECTS.has(subj);

            return (
              <button
                key={subj}
                type="button"
                onClick={() => toggleSubject(subj)}
                className={`relative p-4 rounded-2xl text-xs font-bold text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 min-h-20 ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15 scale-[1.02]"
                    : isAvailable
                    ? "bg-muted/40 border-border/80 text-muted-foreground hover:border-blue-400/50 hover:bg-muted hover:text-foreground"
                    : "bg-muted/20 border-border/40 text-muted-foreground/60 hover:border-amber-400/30"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-black flex items-center justify-center">
                    {badgeNumber}
                  </span>
                )}
                <span className="leading-snug">{subj}</span>
                <span
                  className={`text-[10px] font-medium ${
                    isSelected
                      ? "text-blue-100"
                      : isAvailable
                      ? "text-muted-foreground"
                      : "text-amber-500/70"
                  }`}
                >
                  {isAvailable ? "40 Questions" : "Coming Soon"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Features Checklist */}
        <div className="border-t border-border/60 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Real-time countdown timer with auto-submit on timeout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Keyboard-accessible scientific BODMAS calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>10-column status navigation grid (Gray / Yellow / Green)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>Guess-marking feature to unlock AI diagnostic breakdown</span>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/dashboard"
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            ← Back to Dashboard
          </Link>

          <button
            type="button"
            disabled={isLoading || selectedSubjects.length < 1 || selectedSubjects.length > 4}
            onClick={handleStartExam}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing {selectedSubjects.length} Subject Simulation…</span>
              </>
            ) : (
              <>
                <span>Start Simulation ({selectedSubjects.length} Subject{selectedSubjects.length !== 1 ? "s" : ""} • {durationMins}m)</span>
                <span>🚀</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
