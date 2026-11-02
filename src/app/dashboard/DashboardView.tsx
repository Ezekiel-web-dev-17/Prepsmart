"use client";

import { useState } from "react";
import Link from "next/link";
import { useGamification } from "@/components/gamification/XPToast";
import { awardUserXPAction } from "@/actions/gamification";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { ProgressDashboardClient } from "@/app/progress/ProgressDashboardClient";
import RevisionHubClient, { type RevisionQuestion } from "@/app/revision/RevisionHubClient";
import type { CandidateProgressData } from "@/lib/progress";
import FirstLoginWelcomeModal from "@/components/dashboard/FirstLoginWelcomeModal";
import {
  ChartBarIcon,
  TargetIcon,
  RefreshCwIcon,
  HourglassIcon,
  FlameIcon,
  BookOpenIcon,
  RocketIcon,
  SparklesIcon,
  TrophyIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BeakerIcon,
  BriefcaseIcon,
  PaletteIcon,
  ClockIcon,
} from "@/components/ui/icons";

interface DashboardProfile {
  targetScore: number;
  targetExamDate: string | null;
  departmentStream: string;
  selectedSubjects: string[];
  proficiencyLevel: string;
  dailyStudyMinutes: number;
  preferredStudyTime: string;
}

interface DashboardUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  xp: number;
}

interface DashboardViewProps {
  user: DashboardUser;
  profile: DashboardProfile | null;
  rank: number | null;
  reviewQuestionsCount?: number;
  progressData?: CandidateProgressData | null;
  revisionQuestions?: RevisionQuestion[];
  initialActiveTab?: string;
}

type MainTab = "overview" | "readiness" | "revision";

export default function DashboardView({
  user,
  profile,
  rank,
  reviewQuestionsCount = 0,
  progressData,
  revisionQuestions = [],
  initialActiveTab = "overview",
}: DashboardViewProps) {
  const { triggerXPToast } = useGamification();
  const { isSubscribed, subscribeToPush, sendTestNotification } = usePushNotifications();

  const [mainTab, setMainTab] = useState<MainTab>(() => {
    if (initialActiveTab === "readiness" || initialActiveTab === "progress") return "readiness";
    if (initialActiveTab === "revision") return "revision";
    return "overview";
  });

  const [activeSubjectTab, setActiveSubjectTab] = useState<string>(
    profile?.selectedSubjects[0] || "Use of English"
  );
  const [isClaimingDaily, setIsClaimingDaily] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  // Sync tab with URL if changed
  const handleTabChange = (tab: MainTab) => {
    setMainTab(tab);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // Ignore URL history errors
    }
  };

  const subjects = profile?.selectedSubjects || [
    "Use of English",
    "Mathematics",
    "Physics",
    "Chemistry",
  ];

  // Calculate days remaining to exam
  const examDate = profile?.targetExamDate ? new Date(profile.targetExamDate) : new Date("2027-04-18");
  const today = new Date();
  const diffTime = Math.max(0, examDate.getTime() - today.getTime());
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleClaimStreak = async () => {
    if (hasClaimedToday || isClaimingDaily) return;
    setIsClaimingDaily(true);
    try {
      const result = await awardUserXPAction(user.id, "DAILY_STREAK");
      triggerXPToast({
        points: result.pointsAwarded,
        eventType: "DAILY_STREAK",
        message: "Daily Streak Protected! +25 XP",
        newTotalXp: result.newTotalXp,
      });
      setHasClaimedToday(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsClaimingDaily(false);
    }
  };

  const streamIcon =
    profile?.departmentStream === "commercial" ? (
      <BriefcaseIcon className="w-3.5 h-3.5" />
    ) : profile?.departmentStream === "arts" ? (
      <PaletteIcon className="w-3.5 h-3.5" />
    ) : (
      <BeakerIcon className="w-3.5 h-3.5" />
    );

  const streamLabel =
    profile?.departmentStream === "commercial"
      ? "Commercial Stream"
      : profile?.departmentStream === "arts"
      ? "Arts Stream"
      : "Science Stream";

  return (
    <div className="space-y-8 pb-16">
      {/* First Login Workspace Welcome Modal */}
      <FirstLoginWelcomeModal />

      {/* ── TOP UNIFIED COMMAND CENTER TABS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleTabChange("overview")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === "overview"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <ChartBarIcon className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("readiness")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === "readiness"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <TargetIcon className="w-4 h-4" />
            <span>Readiness (Progress)</span>
            {progressData && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                {progressData.examReadinessScore}%
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabChange("revision")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mainTab === "revision"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span>Revision Hub</span>
            {reviewQuestionsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {reviewQuestionsCount}
              </span>
            )}
          </button>
        </div>

        <div className="text-xs text-muted-foreground hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Unified Command Center • Real Data Engine</span>
        </div>
      </div>

      {/* ── TAB 2: READINESS & PROGRESS ANALYTICS ── */}
      {mainTab === "readiness" && (
        <section className="space-y-6 animate-fadeIn">
          {progressData ? (
            <ProgressDashboardClient data={progressData} />
          ) : (
            <div className="p-12 text-center rounded-2xl bg-card border border-border space-y-3">
              <HourglassIcon className="w-10 h-10 text-blue-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">Loading Real Recorded Readiness...</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Fetching candidate attempts, accuracy metrics, and subject breakdowns from database.
              </p>
            </div>
          )}
        </section>
      )}

      {/* ── TAB 3: REVISION HUB (SPACED ACTIVE RECALL) ── */}
      {mainTab === "revision" && (
        <section className="space-y-6 animate-fadeIn">
          <RevisionHubClient
            initialQuestions={revisionQuestions}
            initialTotal={reviewQuestionsCount}
          />
        </section>
      )}

      {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
      {mainTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner: Countdown & Greeting */}
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-6 sm:p-8 shadow-lg shadow-blue-500/10">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide">
                  <span className="flex items-center gap-1.5">
                    {streamIcon}
                    <span>{streamLabel}</span>
                  </span>
                  <span>•</span>
                  <span>Target: {profile?.targetScore || 280} / 400</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                  Welcome back, {user.name || "JAMB Candidate"}!
                </h1>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  Your daily study session is scheduled for <strong>{profile?.preferredStudyTime || "evening"}</strong>. Consistency beats cramming every single time.
                </p>
              </div>

              {/* Countdown Dial Badge */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black tracking-tight">{daysRemaining}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Days to UTME
                  </div>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">{user.xp}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Total XP
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          </div>

          {/* Core Daily Habit & Motivation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Streak Protector & Gamification */}
            <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Active Study Streak
                  </span>
                  <FlameIcon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-foreground tabular-nums">
                  {progressData?.activeStreak !== undefined ? `${progressData.activeStreak} Day Streak` : "0 Day Streak"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {progressData?.activeStreak && progressData.activeStreak > 0
                    ? `Consecutive days of real practice recorded in your learning log. Keep it active today!`
                    : "Complete a CBT drill or mock exam today to activate your daily study streak."}
                </p>
              </div>

              <button
                type="button"
                disabled={hasClaimedToday || isClaimingDaily}
                onClick={handleClaimStreak}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  hasClaimedToday
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                }`}
              >
                {hasClaimedToday ? (
                  <>
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    <span>Today&apos;s Streak Protected (+25 XP)</span>
                  </>
                ) : isClaimingDaily ? (
                  <span>Claiming...</span>
                ) : (
                  <>
                    <FlameIcon className="w-3.5 h-3.5" />
                    <span>Claim Today&apos;s Streak (+25 XP)</span>
                  </>
                )}
              </button>
            </div>

            {/* Card 2: Quick Resume Last Lesson */}
            <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Curriculum &amp; Syllabus
                  </span>
                  <BookOpenIcon className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="font-extrabold text-base text-foreground">
                  Unified Study &amp; CBT Simulator
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Explore 108+ official syllabus topics, comprehensive study roadmaps, and authentic CBT timed mocks.
                </p>
              </div>

              <Link
                href="/study"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open Study &amp; CBT Hub</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Featured: JAMB CBT Simulation Engine */}
          <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-card via-card to-blue-500/5 border-2 border-blue-500/20 p-6 sm:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>OFFICIAL CBT SIMULATION ENGINE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  JAMB Mock Exam &amp; Timed Practice
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Experience the authentic UTME exam environment. Test yourself with live countdown timers, a 10-column question grid, keyboard-accessible BODMAS calculator, and post-exam AI diagnostics.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <Link
                  href="/study?tab=mock-exam"
                  className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm text-center shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <RocketIcon className="w-4 h-4" />
                  <span>Launch CBT Simulation</span>
                </Link>
                <div className="text-[11px] text-center text-muted-foreground font-medium">
                  Standard 4-subject UTME (180 Qs, 120 mins) or single subject drill
                </div>
              </div>
            </div>
          </section>

          {/* ── PROMINENT REVISION HUB QUICK SWITCH CARD ── */}
          <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border-2 border-amber-500/30 p-6 sm:p-8 shadow-md transition-all hover:border-amber-500/50">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black">
                  <TargetIcon className="w-3.5 h-3.5" />
                  <span>ACTIVE RECALL &amp; MASTERY</span>
                  <span>•</span>
                  <span>
                    {reviewQuestionsCount && reviewQuestionsCount > 0
                      ? `${reviewQuestionsCount} Question${reviewQuestionsCount === 1 ? "" : "s"} In Error Queue`
                      : "Revision Queue Clear"}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  Personalized Revision Hub
                </h2>

                <p className="text-sm sm:text-base text-foreground font-bold leading-relaxed">
                  Review your previous practice and master these concepts right here!
                </p>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {reviewQuestionsCount && reviewQuestionsCount > 0
                    ? `Strengthen questions from previous mock exams and drills in targeted 10-question batches with instant examiner rationale.`
                    : `No questions in your error queue right now. Begin studying syllabus topics or attempt CBT mock exams to populate your revision hub.`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleTabChange("revision")}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm text-center shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <RefreshCwIcon className="w-4 h-4" />
                  <span>Open Revision Queue Tab</span>
                </button>
                <div className="text-[11px] text-center text-muted-foreground font-medium">
                  Earn <strong className="text-foreground">+15 XP</strong> for every concept you master
                </div>
              </div>
            </div>
          </section>

          {/* Recommended Study Materials Based On Onboarding */}
          <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                  Recommended Curriculum Materials
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-yield modules matched to your selected department and targets.
                </p>
              </div>

              {/* Subject switcher tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {subjects.map((subj) => (
                  <button
                    key={subj}
                    type="button"
                    onClick={() => setActiveSubjectTab(subj)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeSubjectTab === subj
                        ? "bg-blue-600 text-white shadow-xs font-bold"
                        : "bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>
            </div>

            {/* Content for the selected active subject */}
            {(() => {
              const normalizeSubjectToSlug = (sub: string) => {
                const s = sub.toLowerCase().trim();
                if (s.includes("english")) return "english";
                if (s.includes("math")) return "mathematics";
                if (s.includes("physic")) return "physics";
                if (s.includes("chem")) return "chemistry";
                if (s.includes("bio")) return "biology";
                if (s.includes("econ")) return "economics";
                if (s.includes("gov")) return "government";
                if (s.includes("lit")) return "literature";
                if (s.includes("com")) return "commerce";
                if (s.includes("acc")) return "accounts";
                if (s.includes("geo")) return "geography";
                return s.replace(/\s+/g, "-");
              };

              const currentStreamSlug = (profile?.departmentStream || "science").toLowerCase();
              const currentSubjectSlug = normalizeSubjectToSlug(activeSubjectTab);

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-border/70 bg-background/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                        <span>Week 1 • Core Foundations</span>
                        <span>High Yield</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">
                        {activeSubjectTab} Fundamental Principles
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Review foundational concepts and definitions frequently tested in the opening 15 questions of UTME.
                      </p>
                    </div>
                    <Link
                      href={`/study?stream=${currentStreamSlug}&subject=${currentSubjectSlug}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 pt-2"
                    >
                      <span>Explore Syllabus</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-5 rounded-2xl border border-border/70 bg-background/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                        <span>Examiner Trap Alert</span>
                        <span>Critical</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">
                        Common Pitfalls in {activeSubjectTab}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Learn how JAMB examiners frame trick questions and how to identify them instantly.
                      </p>
                    </div>
                    <Link
                      href={`/study?stream=${currentStreamSlug}&subject=${currentSubjectSlug}`}
                      className="text-xs font-bold text-amber-600 hover:text-amber-500 flex items-center gap-1 pt-2"
                    >
                      <span>View Examiner Traps</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-5 rounded-2xl border border-border/70 bg-background/50 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                        <span>Active Recall</span>
                        <span>Practice</span>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">
                        Targeted Past Questions Drill
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        20 authentic past UTME questions with instant step-by-step solutions.
                      </p>
                    </div>
                    <Link
                      href={`/study?tab=mock-exam&stream=${currentStreamSlug}&subject=${currentSubjectSlug}`}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 pt-2"
                    >
                      <span>Start Practice Drill</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* Real Recorded Data Summary Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Target Score
              </span>
              <div className="text-xl sm:text-2xl font-black text-foreground tabular-nums">
                {profile?.targetScore || 280}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Active Streak
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-500 tabular-nums">
                {progressData?.activeStreak ?? 0}d
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Questions / Week
              </span>
              <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {progressData?.weeklyQuestionsCount ?? 0}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Total XP
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                {user.xp}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Leaderboard Rank
              </span>
              <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
                {rank ? `#${rank}` : "Unranked"}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 text-center space-y-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                Review Queue
              </span>
              <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {reviewQuestionsCount}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
