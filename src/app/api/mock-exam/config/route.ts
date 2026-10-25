import { NextResponse } from "next/server";

export interface ExamPreset {
  count: number;
  label: string;
  durationSeconds: number;
  durationMinutes: number;
  questionCount: number;
  xpReward: number;
}

export interface ExamConfig {
  presets: ExamPreset[];
  availableSubjects: string[];
  activeQuestionBankSubjects: string[];
  questionsPerSubject: number;
  englishQuestions: number;
}

export const EXAM_CONFIG: ExamConfig = {
  presets: [
    {
      count: 1,
      label: "1 Subject (30m Sprint)",
      durationSeconds: 1800,
      durationMinutes: 30,
      questionCount: 40,
      xpReward: 35,
    },
    {
      count: 2,
      label: "2 Subjects (60m Double)",
      durationSeconds: 3600,
      durationMinutes: 60,
      questionCount: 80,
      xpReward: 70,
    },
    {
      count: 3,
      label: "3 Subjects (90m Triad)",
      durationSeconds: 5400,
      durationMinutes: 90,
      questionCount: 120,
      xpReward: 105,
    },
    {
      count: 4,
      label: "4 Subjects (Full 120m UTME)",
      durationSeconds: 7200,
      durationMinutes: 120,
      questionCount: 160,
      xpReward: 150,
    },
  ],
  availableSubjects: [
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
  ],
  activeQuestionBankSubjects: [
    "Use of English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
  ],
  questionsPerSubject: 40,
  englishQuestions: 60,
};

export async function GET() {
  return NextResponse.json(EXAM_CONFIG, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
