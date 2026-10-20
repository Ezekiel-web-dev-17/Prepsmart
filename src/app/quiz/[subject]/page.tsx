import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import DrillInterface, { type DrillQuestion } from "./DrillInterface";

type Props = {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ topic?: string }>;
};

// Canonical mapping from URL slugs to database subject names
const SUBJECT_MAP: Record<string, string> = {
  "use-of-english": "Use of English",
  english: "Use of English",
  mathematics: "Mathematics",
  maths: "Mathematics",
  physics: "Physics",
  chemistry: "Chemistry",
  biology: "Biology",
  economics: "Economics",
  literature: "Literature",
  government: "Government",
  commerce: "Commerce",
  accounting: "Accounting",
  crk: "Christian Religious Studies",
  crs: "Christian Religious Studies",
  religion: "Christian Religious Studies",
  history: "History",
};

function resolveSubject(slug: string): string {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  if (SUBJECT_MAP[normalized]) {
    return SUBJECT_MAP[normalized];
  }

  // Fallback: Title case slug with spaces
  return normalized
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeStem(text: string): string {
  return text
    .toLowerCase()
    .replace(/\[variant\s*[^\]]*\]/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 80);
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { subject: subjectSlug } = await params;
  const { topic: topicQuery } = await searchParams;
  const subjectName = resolveSubject(subjectSlug);
  const topicTitle = topicQuery ? decodeURIComponent(topicQuery).trim() : null;

  return {
    title: topicTitle
      ? `CBT Drill: ${topicTitle} (${subjectName}) | PrepSmart`
      : `CBT Drill: ${subjectName} Practice | PrepSmart`,
    description: `Targeted JAMB CBT practice drill for ${
      topicTitle || subjectName
    } with instant feedback, examiner explanations, and active recall.`,
  };
}

export const instant = false;

export default async function QuizSubjectPage({
  params,
  searchParams,
}: Props) {
  await connection();
  const { subject: subjectSlug } = await params;
  const { topic: topicQuery } = await searchParams;

  const resolvedSubject = resolveSubject(subjectSlug);
  const decodedTopic = topicQuery ? decodeURIComponent(topicQuery).trim() : null;

  // Retrieve authenticated user if session exists
  let userId: string | undefined;
  try {
    const session = await auth();
    userId = session.userId || undefined;
  } catch {
    userId = undefined;
  }

  // Build Prisma query condition
  let rawQuestions: Array<{
    id: string;
    subject: string;
    year: number;
    text: string;
    options: string;
    correctOption: string;
    topic: string;
    concept: string;
    explanation: string;
    difficulty: string;
  }> = [];

  if (decodedTopic) {
    // Extract meaningful search tokens (>= 4 chars, excluding common stop words)
    const stopWords = new Set([
      "with",
      "from",
      "that",
      "this",
      "what",
      "which",
      "into",
      "over",
      "under",
      "about",
      "their",
      "where",
      "and",
    ]);

    const tokens = decodedTopic
      .split(/[\s,()/-]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 4 && !stopWords.has(t.toLowerCase()));

    const orFilters = [
      { topic: { contains: decodedTopic } },
      { concept: { contains: decodedTopic } },
      ...tokens.flatMap((token) => [
        { topic: { contains: token } },
        { concept: { contains: token } },
      ]),
    ];

    rawQuestions = await prisma.question.findMany({
      where: {
        subject: resolvedSubject,
        isActive: true,
        OR: orFilters,
      },
      select: {
        id: true,
        subject: true,
        year: true,
        text: true,
        options: true,
        correctOption: true,
        topic: true,
        concept: true,
        explanation: true,
        difficulty: true,
      },
    });
  } else {
    // Subject-wide drill
    rawQuestions = await prisma.question.findMany({
      where: {
        subject: resolvedSubject,
        isActive: true,
      },
      select: {
        id: true,
        subject: true,
        year: true,
        text: true,
        options: true,
        correctOption: true,
        topic: true,
        concept: true,
        explanation: true,
        difficulty: true,
      },
    });
  }

  // Deduplicate by question ID and canonical stem
  const seenIds = new Set<string>();
  const seenStems = new Set<string>();
  const deduplicatedQuestions: typeof rawQuestions = [];

  for (const q of rawQuestions) {
    if (seenIds.has(q.id)) continue;
    const stem = normalizeStem(q.text);
    if (seenStems.has(stem)) continue;

    seenIds.add(q.id);
    seenStems.add(stem);
    deduplicatedQuestions.push(q);
  }

  // Randomize batch and limit to up to 20 questions
  const randomizedBatch = shuffleArray(deduplicatedQuestions).slice(0, 20);

  // ====================================================
  // EMPTY STATE: Apple Liquid Glass Encapsulation
  // ====================================================
  if (randomizedBatch.length === 0) {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
        {/* Soft liquid light background */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-xl rounded-3xl bg-card/80 dark:bg-card/65 backdrop-blur-2xl border border-white/20 dark:border-white/10 p-8 sm:p-12 text-center shadow-2xl space-y-6 animate-in fade-in-50 zoom-in-95 duration-300">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-3xl shadow-inner">
            📚
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <span>{resolvedSubject}</span>
              {decodedTopic && <span>• {decodedTopic}</span>}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Topic Practice in Preparation
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              New practice materials for this topic are being prepared. Check
              back soon!
            </p>

            <p className="text-xs text-muted-foreground/80 max-w-md mx-auto">
              Our academic examiners are curating authentic past questions and
              step-by-step solutions for this concept. In the meantime, explore
              available syllabus topics or take a full practice drill.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/study"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              ← Explore Other {resolvedSubject} Topics
            </Link>

            {decodedTopic && (
              <Link
                href={`/quiz/${subjectSlug}`}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-card hover:bg-muted text-foreground border border-border text-xs sm:text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Practice All {resolvedSubject} Topics
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // STRIP HELPER METADATA & PASS TO DRILL INTERFACE
  // Topic/concept hints are stripped from active drill questions
  // ====================================================
  const formattedQuestions: DrillQuestion[] = randomizedBatch.map((q) => {
    let parsedOptions: Array<{ id: string; text: string }> = [];
    try {
      parsedOptions = JSON.parse(q.options);
    } catch {
      parsedOptions = [];
    }

    return {
      id: q.id,
      subject: q.subject,
      year: q.year,
      text: q.text,
      options: parsedOptions,
      correctOption: q.correctOption,
      explanation: q.explanation,
      difficulty: q.difficulty,
    };
  });

  return (
    <DrillInterface
      questions={formattedQuestions}
      subject={resolvedSubject}
      topicName={decodedTopic || undefined}
      userId={userId}
    />
  );
}
