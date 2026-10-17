"use client";

import { useState } from "react";
import Link from "next/link";
import { useGamification } from "@/components/gamification/XPToast";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { awardUserXPAction } from "@/actions/gamification";

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
}

export default function DashboardView({
  user,
  profile,
  rank,
  reviewQuestionsCount = 0,
}: DashboardViewProps) {
  const { triggerXPToast } = useGamification();
  const { isSubscribed, subscribeToPush, sendTestNotification } = usePushNotifications();
  const [activeSubjectTab, setActiveSubjectTab] = useState<string>(
    profile?.selectedSubjects[0] || "Use of English"
  );
  const [isClaimingDaily, setIsClaimingDaily] = useState(false);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSentSuccess, setTestSentSuccess] = useState(false);

  const handleSendTestNotification = async () => {
    if (isSendingTest) return;
    setIsSendingTest(true);
    try {
      await sendTestNotification(
        "PrepSmart Study Challenge 🔥",
        "Keep your streak alive! 10 minutes of high-yield practice awaits."
      );
      setTestSentSuccess(true);
      setTimeout(() => setTestSentSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingTest(false);
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

  const streamLabel =
    profile?.departmentStream === "science"
      ? "Science Stream 🔬"
      : profile?.departmentStream === "commercial"
      ? "Commercial Stream 📊"
      : "Arts Stream 🎨";

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner / Candidate Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 border border-blue-800/40 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{streamLabel}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {user.name?.split(" ")[0] || "Candidate"}!
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl leading-relaxed">
              Targeting <strong>{profile?.targetScore || 280} points</strong> in the
              upcoming UTME. Your personalized study curriculum is calibrated for{" "}
              <strong>{profile?.dailyStudyMinutes || 45} mins/day</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/revision"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Revision Hub</span>
                <span>🎯</span>
              </Link>
              <Link
                href="/mock-exam"
                className="px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Take Mock Exam</span>
                <span>⏱️</span>
              </Link>
              <Link
                href="/study"
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 transition-all"
              >
                Continue Syllabus →
              </Link>
            </div>
          </div>

          {/* Quick Exam Countdown & Push Status */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-30">
              <span className="text-3xl font-black text-amber-400 tabular-nums block leading-none">
                {daysRemaining}
              </span>
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block mt-1">
                Days to UTME
              </span>
            </div>

            <div className="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-30">
              <span className="text-3xl font-black text-emerald-400 tabular-nums block leading-none">
                {user.xp}
              </span>
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider block mt-1">
                Accumulated XP
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Action Strip: Daily Streak + Last Lesson + Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Streak Tracker */}
        <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Study Habit
              </span>
              <span className="text-xl">🔥</span>
            </div>
            <h3 className="font-extrabold text-base text-foreground">
              Daily Streak: 3 Days
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Check in daily and complete at least one exercise to keep your streak intact.
            </p>
          </div>

          <button
            type="button"
            disabled={hasClaimedToday || isClaimingDaily}
            onClick={handleClaimStreak}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              hasClaimedToday
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 cursor-default"
                : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
            }`}
          >
            {hasClaimedToday
              ? "✓ Today's Streak Claimed (+25 XP)"
              : isClaimingDaily
              ? "Claiming..."
              : "Claim Today's Streak (+25 XP)"}
          </button>
        </div>

        {/* Card 2: Quick Resume Last Lesson */}
        <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Resume Preparation
              </span>
              <span className="text-xl">📖</span>
            </div>
            <h3 className="font-extrabold text-base text-foreground">
              Calculus & Coordinate Geometry
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Mathematics • High-yield topic with 8 typical examiner traps.
            </p>
          </div>

          <Link
            href="/study"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Continue Lesson</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Card 3: Push Notification Status */}
        <div className="rounded-2xl bg-card border border-border/80 p-5 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Browser Reminders
              </span>
              <span className="text-xl">🔔</span>
            </div>
            <h3 className="font-extrabold text-base text-foreground">
              Duolingo-Style Reminders
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {isSubscribed
                ? "Active! Native alerts scheduled for your preferred study routine."
                : "Turn on browser alerts to protect your streak and receive high-yield study cues."}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={isSendingTest}
              onClick={handleSendTestNotification}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 ${
                testSentSuccess
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold"
                  : "bg-muted hover:bg-muted/80 text-foreground border-border hover:border-blue-500/40"
              }`}
            >
              {isSendingTest ? (
                <>
                  <span className="animate-spin inline-block">⏳</span>
                  <span>Sending Alert...</span>
                </>
              ) : testSentSuccess ? (
                <>
                  <span>✓</span>
                  <span>Test Notification Sent! 🚀</span>
                </>
              ) : (
                <>
                  <span>Send Test Notification</span>
                  <span>🚀</span>
                </>
              )}
            </button>

            {!isSubscribed && (
              <button
                type="button"
                onClick={async () => {
                  const success = await subscribeToPush();
                  if (success) {
                    await handleSendTestNotification();
                  }
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Enable Native Push</span>
                <span>🔔</span>
              </button>
            )}
          </div>
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
              JAMB Mock Exam & Timed Practice
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Experience the authentic UTME exam environment. Test yourself with live countdown timers, a 10-column question grid, keyboard-accessible BODMAS calculator, and post-exam AI diagnostics.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-500">✓</span> Full 4-Subject Mock (120 Mins)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-blue-500">✓</span> Single Subject Sprint (30 Mins)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-purple-500">✓</span> AI Concept Mastery & Revision Insights
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/mock-exam"
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm text-center shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Launch Mock Simulation</span>
              <span>🚀</span>
            </Link>
            <div className="text-[11px] text-center text-muted-foreground font-medium">
              Earn up to <strong className="text-foreground">+150 XP</strong> per completed simulation
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMINENT REVISION HUB FEATURE CARD ── */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-500/10 via-amber-500/5 to-indigo-500/10 border-2 border-amber-500/30 p-6 sm:p-8 shadow-md transition-all hover:border-amber-500/50">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black">
              <span>🎯 ACTIVE RECALL & MASTERY</span>
              <span>•</span>
              <span>
                {reviewQuestionsCount && reviewQuestionsCount > 0
                  ? `${reviewQuestionsCount} Question${reviewQuestionsCount === 1 ? "" : "s"} Ready for Review`
                  : "Continuous Concept Reinforcement"}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Personalized Revision Hub
            </h2>

            <p className="text-sm sm:text-base text-foreground font-bold leading-relaxed">
              Review your previous practice and master these concepts!
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Strengthen questions from previous mock exams and drills in targeted 10-question batches. Practice with active recall, review step-by-step examiner solutions, and convert every tricky topic into guaranteed UTME marks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/revision"
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm text-center shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Launch Revision Hub</span>
              <span>🎯</span>
            </Link>
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
              Personalized syllabus guides and practice modules for your 4 selected UTME subjects.
            </p>
          </div>

          <Link
            href="/study"
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline self-start sm:self-auto"
          >
            Browse Full Syllabus →
          </Link>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3">
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

        {/* Materials Grid for Selected Subject */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Core Module
              </span>
              <span className="text-xs font-bold text-muted-foreground">High Yield</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              Fundamental Principles of {activeSubjectTab}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Official JAMB syllabus breakdown covering key objectives and textbook references.
            </p>
            <Link
              href="/study"
              className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1"
            >
              <span>Explore Module</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Examiner Traps
              </span>
              <span className="text-xs font-bold text-muted-foreground">12 Traps</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              Most Repeated Traps in {activeSubjectTab}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              Learn how JAMB examiners frame trick questions and how to identify them instantly.
            </p>
            <Link
              href="/revision"
              className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold hover:underline pt-1"
            >
              <span>Review Traps</span>
              <span>→</span>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-muted/30 border border-border/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active Recall
              </span>
              <span className="text-xs font-bold text-muted-foreground">+50 XP</span>
            </div>
            <h4 className="font-extrabold text-sm text-foreground">
              Timed Practice Test ({activeSubjectTab})
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              20 authentic past UTME questions with instant step-by-step solutions.
            </p>
            <Link
              href="/study"
              className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline pt-1"
            >
              <span>Start Practice</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Grid: Leaderboard Standings + University Target Quick Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Leaderboard Standings */}
        <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Gamification Ranking
              </span>
              <h3 className="font-extrabold text-base text-foreground mt-0.5">
                Global Leaderboard
              </h3>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              View Top 50 →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
                #{rank || "—"}
              </div>
              <div>
                <span className="font-bold text-sm text-foreground block">
                  Your Current Rank
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.xp} Total XP Accumulated
                </span>
              </div>
            </div>

            <Link
              href="/leaderboard"
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-all"
            >
              Climb Ranks
            </Link>
          </div>
        </div>

        {/* Card 2: Universities Counsellor Quick Link */}
        <div className="rounded-2xl bg-card border border-border/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Target Verification
              </span>
              <h3 className="font-extrabold text-base text-foreground mt-0.5">
                Admission Cut-Offs
              </h3>
            </div>
            <Link
              href="/universities"
              className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              All Universities →
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-center justify-between">
            <div>
              <span className="font-bold text-sm text-foreground block">
                Target Score: {profile?.targetScore || 280} pts
              </span>
              <span className="text-xs text-muted-foreground">
                Compare departmental requirements & screening documents.
              </span>
            </div>

            <Link
              href="/universities"
              className="px-3 py-1.5 rounded-lg bg-card border border-border text-foreground hover:bg-muted text-xs font-bold transition-all"
            >
              Check Cut-Offs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
