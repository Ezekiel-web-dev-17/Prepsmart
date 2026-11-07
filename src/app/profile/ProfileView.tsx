"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUserContext, DepartmentStream, StudyTimeOfDay, ProficiencyLevel } from "@/context/UserContext";
import {
  TargetIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ArrowRightIcon,
  ZapIcon,
} from "@/components/ui/icons";

const STREAM_CONFIG: Record<
  DepartmentStream,
  { label: string; badgeColor: string; defaultSubjects: string[]; availableSubjects: string[] }
> = {
  science: {
    label: "Science & Engineering",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
    defaultSubjects: ["Use of English", "Mathematics", "Physics", "Chemistry"],
    availableSubjects: [
      "Use of English",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Agricultural Science",
      "Geography",
    ],
  },
  commercial: {
    label: "Commercial & Business Administration",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
    defaultSubjects: ["Use of English", "Mathematics", "Economics", "Accounting"],
    availableSubjects: [
      "Use of English",
      "Mathematics",
      "Economics",
      "Accounting",
      "Commerce",
      "Government",
      "Geography",
    ],
  },
  arts: {
    label: "Arts, Law & Humanities",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30",
    defaultSubjects: ["Use of English", "Literature", "Government", "Christian Religious Studies"],
    availableSubjects: [
      "Use of English",
      "Literature",
      "Government",
      "Christian Religious Studies",
      "Islamic Religious Studies",
      "History",
      "Economics",
    ],
  },
};

export default function ProfileView() {
  const { user, department, selectedSubjects, targetScore, xp, isSignedIn, isLoading, updateProfile } =
    useUserContext();

  const [formStream, setFormStream] = useState<DepartmentStream>(department);
  const [formScore, setFormScore] = useState<number>(targetScore);
  const [formSubjects, setFormSubjects] = useState<string[]>(selectedSubjects);
  const [formDailyMinutes, setFormDailyMinutes] = useState<number>(user?.dailyStudyMinutes || 45);
  const [formStudyTime, setFormStudyTime] = useState<StudyTimeOfDay>(user?.preferredStudyTime || "evening");
  const [formProficiency, setFormProficiency] = useState<ProficiencyLevel>(user?.proficiencyLevel || "intermediate");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state when user context is loaded
  useEffect(() => {
    if (user) {
      setFormStream(user.departmentStream || user.department);
      setFormScore(user.targetScore || 280);
      setFormSubjects(user.selectedSubjects || STREAM_CONFIG[user.department].defaultSubjects);
      setFormDailyMinutes(user.dailyStudyMinutes || 45);
      setFormStudyTime(user.preferredStudyTime || "evening");
      setFormProficiency(user.proficiencyLevel || "intermediate");
    }
  }, [user]);

  const handleStreamChange = (newStream: DepartmentStream) => {
    setFormStream(newStream);
    setFormSubjects(STREAM_CONFIG[newStream].defaultSubjects);
  };

  const handleToggleSubject = (sub: string) => {
    if (sub === "Use of English") return; // English is compulsory

    if (formSubjects.includes(sub)) {
      if (formSubjects.length <= 2) return; // Keep at least 2
      setFormSubjects(formSubjects.filter((s) => s !== sub));
    } else {
      if (formSubjects.length >= 4) {
        // Replace last non-English subject
        const nonEnglish = formSubjects.filter((s) => s !== "Use of English");
        const keep = formSubjects.slice(0, 3);
        setFormSubjects([...keep, sub]);
      } else {
        setFormSubjects([...formSubjects, sub]);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    const success = await updateProfile({
      departmentStream: formStream,
      department: formStream,
      targetScore: formScore,
      selectedSubjects: formSubjects,
      dailyStudyMinutes: formDailyMinutes,
      preferredStudyTime: formStudyTime,
      proficiencyLevel: formProficiency,
    });

    setIsSaving(false);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  if (!isSignedIn && !isLoading) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl bg-card border border-border p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto">
          <TargetIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">Candidate Sign-In Required</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to view and customize your personalized UTME study stream, target score, and subjects.
          </p>
        </div>
        <Link
          href="/sign-in?redirect_url=/profile"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm"
        >
          <span>Sign In to Your Account</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentStreamConfig = STREAM_CONFIG[formStream] || STREAM_CONFIG.science;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "CA"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">{user?.name || "Candidate"}</h1>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified Candidate
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-muted/60 border border-border text-center min-w-24">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Total XP
              </span>
              <span className="text-lg font-black text-foreground flex items-center justify-center gap-1">
                <ZapIcon className="w-4 h-4 text-amber-500" />
                {xp}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-muted/60 border border-border text-center min-w-24">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                JAMB Target
              </span>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                {formScore} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Academic Stream */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div>
            <h2 className="text-base font-black text-foreground">1. Academic Discipline &amp; Stream</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select your academic track. This customizes your curriculum syllabus, topic priorities, and mock exams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["science", "commercial", "arts"] as DepartmentStream[]).map((st) => {
              const cfg = STREAM_CONFIG[st];
              const isSelected = formStream === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStreamChange(st)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-blue-500/10 border-blue-600 dark:border-blue-400 ring-2 ring-blue-500/30"
                      : "bg-card hover:bg-muted border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.badgeColor}`}>
                      {st}
                    </span>
                    {isSelected && <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground">{cfg.label}</h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {cfg.defaultSubjects.slice(0, 3).join(", ")}...
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: 4 UTME Subjects */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-foreground">2. Your 4 UTME Subject Combination</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                JAMB tests candidates on exactly 4 subjects. Use of English is compulsory for all candidates.
              </p>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full self-start sm:self-auto">
              {formSubjects.length} of 4 selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {currentStreamConfig.availableSubjects.map((sub) => {
              const isCompulsory = sub === "Use of English";
              const isSelected = formSubjects.includes(sub);

              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => handleToggleSubject(sub)}
                  disabled={isCompulsory}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-card hover:bg-muted text-foreground border-border"
                  } ${isCompulsory ? "opacity-90 cursor-default" : ""}`}
                >
                  {isCompulsory && <span className="text-[10px] opacity-75 font-semibold">Compulsory:</span>}
                  <span>{sub}</span>
                  {isSelected && <CheckCircleIcon className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Target Score & Schedule */}
        <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-black text-foreground">3. Target JAMB Score &amp; Cadence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set an ambitious but achievable target score. Competitive programmes like Medicine and Law typically require 270+.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Target UTME Score (/400)</span>
              <span className="text-xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {formScore} pts
              </span>
            </div>
            <input
              type="range"
              min="180"
              max="360"
              step="5"
              value={formScore}
              onChange={(e) => setFormScore(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
              <span>180 (Pass)</span>
              <span>250 (Competitive)</span>
              <span>300+ (Premier)</span>
              <span>360 (Top 1%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Daily Study Commitment</label>
              <select
                value={formDailyMinutes}
                onChange={(e) => setFormDailyMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 Minutes / day (Steady pace)</option>
                <option value={45}>45 Minutes / day (Recommended)</option>
                <option value={60}>60 Minutes / day (Intensive)</option>
                <option value={90}>90 Minutes / day (Exam sprint)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Preferred Study Routine</label>
              <select
                value={formStudyTime}
                onChange={(e) => setFormStudyTime(e.target.value as StudyTimeOfDay)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="morning">Morning (6:00 AM – 9:00 AM)</option>
                <option value="afternoon">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="evening">Evening (6:00 PM – 9:00 PM)</option>
                <option value="night">Night (9:00 PM – 11:30 PM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button & Feedback */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/study"
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            ← Return to Study Hub
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                <CheckCircleIcon className="w-4 h-4" />
                Profile updated successfully!
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <span>Saving...</span> : <span>Save Candidate Preferences</span>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

