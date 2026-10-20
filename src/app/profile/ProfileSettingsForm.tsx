"use client";

import React, { useState } from "react";
import { updateProfileSettingsAction } from "@/actions/profile";
import { useGamification } from "@/components/gamification/XPToast";
import type { Department } from "@/actions/profile";

export interface ProfileSettingsFormProps {
  initialData: {
    department: Department;
    targetScore: number;
    targetExamDate: string | null;
    selectedSubjects: string[];
    proficiencyLevel: "beginner" | "intermediate" | "advanced";
    dailyStudyMinutes: number;
    preferredStudyTime: "morning" | "afternoon" | "evening" | "night";
  };
  userEmail: string;
  userName: string | null;
}

const AVAILABLE_SUBJECTS_BY_STREAM: Record<Department, string[]> = {
  SCIENCE: [
    "Use of English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Agricultural Science",
  ],
  ART: [
    "Use of English",
    "Literature",
    "Government",
    "Christian Religious Studies",
    "Islamic Studies",
    "History",
  ],
  COMMERCIAL: [
    "Use of English",
    "Mathematics",
    "Economics",
    "Commerce",
    "Financial Accounting",
    "Government",
  ],
};

export function ProfileSettingsForm({
  initialData,
  userEmail,
  userName,
}: ProfileSettingsFormProps) {
  const { triggerXPToast } = useGamification();

  const [department, setDepartment] = useState<Department>(initialData.department || "SCIENCE");
  const [targetScore, setTargetScore] = useState<number>(initialData.targetScore || 280);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData.selectedSubjects || ["Use of English", "Mathematics", "Physics", "Chemistry"]
  );
  const [proficiency, setProficiency] = useState(initialData.proficiencyLevel || "intermediate");
  const [dailyMinutes, setDailyMinutes] = useState<number>(initialData.dailyStudyMinutes || 45);
  const [preferredTime, setPreferredTime] = useState(initialData.preferredStudyTime || "evening");

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleDepartmentChange = (newDept: Department) => {
    setDepartment(newDept);
    // Auto-align default subjects if switching streams
    const recommended = AVAILABLE_SUBJECTS_BY_STREAM[newDept].slice(0, 4);
    setSelectedSubjects(recommended);
  };

  const handleToggleSubject = (subject: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await updateProfileSettingsAction({
        department,
        targetScore,
        targetExamDate: initialData.targetExamDate,
        selectedSubjects,
        proficiencyLevel: proficiency,
        dailyStudyMinutes: dailyMinutes,
        preferredStudyTime: preferredTime,
      });

      if (res.success) {
        setStatusMessage({
          type: "success",
          text: "Profile & academic settings updated successfully! ✨",
        });
        triggerXPToast({
          points: 10,
          eventType: "TOPIC_COMPLETED",
          message: "Profile Settings Calibrated! +10 XP",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to save profile settings.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while saving profile settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* User Information Summary Card */}
      <div className="p-6 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Candidate Account
          </span>
          <h2 className="text-xl font-black text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            {userName || "Candidate"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{userEmail}</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-center">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block">
            Academic Stream
          </span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            {department}
          </span>
        </div>
      </div>

      {/* 1. Academic Department Stream Selection */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Syllabus Calibration
          </span>
          <h3 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Academic Department
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Choose your UTME discipline stream to personalize syllabus topics and curriculum modules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["SCIENCE", "COMMERCIAL", "ART"] as Department[]).map((dept) => {
            const isSelected = department === dept;
            const label =
              dept === "SCIENCE"
                ? "Science 🔬"
                : dept === "COMMERCIAL"
                ? "Commercial 📊"
                : "Arts & Humanities 🎨";
            const desc =
              dept === "SCIENCE"
                ? "Engineering, Medicine, Computing, Sciences"
                : dept === "COMMERCIAL"
                ? "Accounting, Business, Finance, Economics"
                : "Law, Mass Communication, Arts, Languages";

            return (
              <button
                key={dept}
                type="button"
                onClick={() => handleDepartmentChange(dept)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-blue-500/15 border-blue-500 dark:border-blue-400 shadow-sm"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-blue-400/30"
                }`}
              >
                <span className="font-extrabold text-sm block text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {label}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-1 leading-snug">
                  {desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Score Calibration */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Score Benchmark
            </span>
            <h3 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
              Target JAMB Score
            </h3>
          </div>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {targetScore}
            <span className="text-sm font-bold text-neutral-400 ml-1">/ 400</span>
          </span>
        </div>

        <input
          type="range"
          min={160}
          max={380}
          step={5}
          value={targetScore}
          onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />

        <div className="flex justify-between text-[11px] font-semibold text-neutral-400">
          <span>Minimum Cut-Off (160)</span>
          <span>Competitive (280)</span>
          <span>Top Tier MBBS/Law (350+)</span>
        </div>
      </div>

      {/* 3. Selected Subjects */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md space-y-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            UTME Combination
          </span>
          <h3 className="text-lg font-extrabold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight">
            Selected Subjects ({selectedSubjects.length} of 4)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Use of English is compulsory for all candidates. Select your remaining 3 subjects.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {AVAILABLE_SUBJECTS_BY_STREAM[department].map((subject) => {
            const isSelected = selectedSubjects.includes(subject);
            const isCompulsory = subject === "Use of English";

            return (
              <button
                key={subject}
                type="button"
                disabled={isCompulsory}
                onClick={() => handleToggleSubject(subject)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-blue-400/40"
                } ${isCompulsory ? "cursor-default opacity-90" : "cursor-pointer"}`}
              >
                {subject} {isCompulsory && "(Compulsory)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Study Cadence & Preferred Time */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/65 dark:bg-[#1C1C1E]/65 backdrop-blur-2xl backdrop-saturate-180 border border-white/60 dark:border-white/10 shadow-liquid-md dark:shadow-liquid-dark-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Daily Study Target
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyMinutes(mins)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  dailyMinutes === mins
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-blue-400/30"
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Preferred Routine
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "morning", label: "Morning 🌅" },
              { id: "afternoon", label: "Noon ☀️" },
              { id: "evening", label: "Evening 🌆" },
              { id: "night", label: "Night 🌙" },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setPreferredTime(slot.id as any)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  preferredTime === slot.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-blue-400/30"
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          }`}
        >
          <span>{statusMessage.type === "success" ? "✓" : "⚠️"}</span>
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="
            px-8 py-3.5 rounded-2xl
            bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
            text-white font-extrabold text-sm tracking-wide
            shadow-liquid-sm hover:shadow-liquid-md
            border border-blue-400/30
            transition-all duration-300
            hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-50 cursor-pointer
          "
        >
          {isSaving ? "Saving Settings..." : "Save Profile Settings ✨"}
        </button>
      </div>
    </form>
  );
}
