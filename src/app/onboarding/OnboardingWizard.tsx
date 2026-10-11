"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useGamification } from "@/components/gamification/XPToast";
import { saveOnboardingProfile } from "@/actions/onboarding";

const STREAMS_CONFIG = {
  science: {
    label: "Science Stream",
    icon: "🔬",
    description: "Medicine, Engineering, Computing, Pharmacy & Pure Sciences",
    defaultSubjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
  },
  commercial: {
    label: "Commercial Stream",
    icon: "📊",
    description: "Accounting, Economics, Business Admin, Banking & Finance",
    defaultSubjects: ["Use of English", "Mathematics", "Economics", "Principles of Accounts"],
  },
  arts: {
    label: "Arts & Humanities",
    icon: "🎨",
    description: "Law, Mass Communication, Literature, Linguistics & Political Science",
    defaultSubjects: ["Use of English", "Literature in English", "Government", "CRS/IRS"],
  },
};

const ALL_SUBJECTS = [
  "Use of English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Principles of Accounts",
  "Commerce",
  "Government",
  "Literature in English",
  "Christian Religious Studies (CRS)",
  "Islamic Studies (IRS)",
  "Agricultural Science",
  "Geography",
  "History",
];

interface OnboardingWizardProps {
  initialUserId?: string;
}

export default function OnboardingWizard({ initialUserId }: OnboardingWizardProps) {
  const router = useRouter();
  const { triggerXPToast } = useGamification();
  const { isSupported, permission, subscribeToPush, sendTestNotification } =
    usePushNotifications();

  const [step, setStep] = useState(1);
  const [targetScore, setTargetScore] = useState<number>(280);
  const [targetExamDate, setTargetExamDate] = useState<string>("2027-04-18");
  const [stream, setStream] = useState<"science" | "commercial" | "arts">("science");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    STREAMS_CONFIG.science.defaultSubjects
  );
  const [proficiency, setProficiency] = useState<"beginner" | "intermediate" | "advanced">(
    "intermediate"
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(45);
  const [preferredTime, setPreferredTime] = useState<"morning" | "afternoon" | "evening" | "night">(
    "evening"
  );
  const [isSaving, setIsSaving] = useState(false);
  const [pushOptIn, setPushOptIn] = useState(false);

  const handleStreamChange = (newStream: "science" | "commercial" | "arts") => {
    setStream(newStream);
    setSelectedSubjects(STREAMS_CONFIG[newStream].defaultSubjects);
  };

  const toggleSubject = (subject: string) => {
    if (subject === "Use of English") return; // Compulsory in JAMB
    if (selectedSubjects.includes(subject)) {
      if (selectedSubjects.length > 2) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      }
    } else {
      if (selectedSubjects.length < 5) {
        setSelectedSubjects([...selectedSubjects, subject]);
      }
    }
  };

  const handlePushToggle = async () => {
    if (!pushOptIn) {
      const success = await subscribeToPush();
      setPushOptIn(success);
      if (success) {
        sendTestNotification("Duolingo-style Streak Enabled 🔥", "You'll receive lesson reminders!");
      }
    } else {
      setPushOptIn(false);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const res = await saveOnboardingProfile({
        targetScore,
        targetExamDate,
        departmentStream: stream,
        selectedSubjects,
        proficiencyLevel: proficiency,
        dailyStudyMinutes: dailyMinutes,
        preferredStudyTime: preferredTime,
      });

      if (res.success) {
        triggerXPToast({
          points: 100,
          eventType: "DIAGNOSTIC_COMPLETED",
          message: "Onboarding Complete! +100 XP Bonus",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Wizard Step Progress Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>Candidate Onboarding</span>
          <span>Step {step} of 4</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Card */}
      <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Step 1: Target Score & Exam Date */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 1: Goal Setting
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                What is your target JAMB UTME score?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                We use your target score to calculate daily practice quotas and tailor
                departmental university recommendations.
              </p>
            </div>

            {/* Score Selector */}
            <div className="space-y-4 pt-2">
              <div className="text-center py-6 rounded-2xl bg-muted/40 border border-border">
                <span className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">
                  {targetScore}
                </span>
                <span className="text-sm font-bold text-muted-foreground block mt-1">
                  Target Score (out of 400)
                </span>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {targetScore >= 300
                    ? "🌟 Top 1% Competitive (Medicine / Software / Top Law)"
                    : targetScore >= 250
                    ? "🚀 Highly Competitive (Engineering / Pharmacy / Finance)"
                    : "🎯 Standard Admission Target"}
                </p>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="180"
                max="360"
                step="5"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                <span>180 pts (General Min)</span>
                <span>250 pts</span>
                <span>300 pts</span>
                <span>360 pts (Scholarship)</span>
              </div>
            </div>

            {/* Target Exam Date */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Target UTME Examination Date
              </label>
              <input
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Stream & Subjects Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 2: Subject Combination
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Select your academic stream & 4 UTME subjects
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Use of English is compulsory. Select 3 other subjects aligned with your
                intended degree course.
              </p>
            </div>

            {/* Stream Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(STREAMS_CONFIG) as Array<keyof typeof STREAMS_CONFIG>).map((key) => {
                const conf = STREAMS_CONFIG[key];
                const isSelected = stream === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleStreamChange(key)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20 shadow-xs"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl mb-1 block">{conf.icon}</span>
                    <h4 className="font-extrabold text-sm text-foreground">{conf.label}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                      {conf.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Subjects Badges */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Your Chosen 4 Subjects:</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {selectedSubjects.length} of 4 Selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {ALL_SUBJECTS.map((subj) => {
                  const isChosen = selectedSubjects.includes(subj);
                  const isCompulsory = subj === "Use of English";

                  return (
                    <button
                      key={subj}
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isChosen
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs font-bold"
                          : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      } ${isCompulsory ? "cursor-not-allowed opacity-90" : ""}`}
                    >
                      {subj} {isCompulsory && "(Compulsory)"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Proficiency & Routine */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 3: Study Cadence
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                How do you plan to prepare?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Customize your daily commitment and let PrepSmart pace your curriculum.
              </p>
            </div>

            {/* Proficiency Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Current Preparation Baseline
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "beginner", label: "Beginner", desc: "Starting syllabus from scratch" },
                  { id: "intermediate", label: "Intermediate", desc: "Familiar with most SSCE topics" },
                  { id: "advanced", label: "Advanced", desc: "Focusing on speed and examiner traps" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProficiency(item.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      proficiency === item.id
                        ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 font-bold"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground block">{item.label}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block leading-tight">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Commitment */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Daily Study Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyMinutes(mins)}
                    className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      dailyMinutes === mins
                        ? "bg-blue-600 text-white border-blue-600 font-black shadow-xs"
                        : "bg-card border-border hover:bg-muted text-muted-foreground text-xs font-bold"
                    }`}
                  >
                    {mins} Mins/Day
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Time */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Preferred Study Time
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "morning", label: "Morning 🌅" },
                  { id: "afternoon", label: "Afternoon ☀️" },
                  { id: "evening", label: "Evening 🌆" },
                  { id: "night", label: "Late Night 🌙" },
                ].map((time) => (
                  <button
                    key={time.id}
                    type="button"
                    onClick={() => setPreferredTime(time.id as any)}
                    className={`py-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      preferredTime === time.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-card border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Web Push Notifications & Streak Protection */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Step 4: Micro-Habits & Reminders
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Protect your study streak with browser reminders
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Never miss your {dailyMinutes}-minute daily quota. We send gentle
                Pinterest/Duolingo-style push notifications directly to your browser.
              </p>
            </div>

            {/* Duolingo Streak Box */}
            <div className="p-6 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <h4 className="font-extrabold text-base text-foreground">
                    PrepSmart Streak Guardian
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Candidates who maintain a 14-day streak score an average of 42 points
                    higher on the UTME.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🔔</span>
                  <div className="text-xs font-bold text-foreground">
                    Enable Daily Push Notifications
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePushToggle}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    pushOptIn
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {pushOptIn ? "Subscribed ✓" : "Allow Reminders"}
                </button>
              </div>

              {pushOptIn && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Browser Push Notifications Active!</span>
                  <button
                    type="button"
                    onClick={() => sendTestNotification()}
                    className="underline text-[11px] cursor-pointer hover:text-emerald-700"
                  >
                    Send test chime
                  </button>
                </div>
              )}
            </div>

            {/* Bonus Reward Teaser */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs text-blue-900 dark:text-blue-200">
                <span className="text-lg">🎁</span>
                <span>
                  Completing onboarding unlocks <strong>+100 Gamification XP</strong>!
                </span>
              </div>
              <span className="text-xs font-black text-amber-500">+100 XP</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons Row */}
        <div className="mt-8 pt-5 border-t border-border/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? "Finalizing Plan..." : "Complete & Enter Dashboard 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
