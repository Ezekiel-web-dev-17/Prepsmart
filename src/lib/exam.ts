/**
 * Secure Exam Session Library
 *
 * Security Architecture:
 * - correctOption fields NEVER leave the server — stripped before sending to client
 * - sessionToken is a cryptographically random 32-byte hex value (not sequential IDs)
 * - Server enforces timer: submission rejected if now() > expiresAt
 * - All answer validation and scoring happens exclusively here, server-side
 * - Each session's questions are locked at creation time (no mid-session swaps)
 * - One attempt per session (@@unique([sessionId])) prevents replay attacks
 */

import "server-only";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

// Durations (seconds)
const DURATION_FOUR_SUBJECTS = 7200; // 2 hours
const DURATION_SINGLE_SUBJECT = 1800; // 30 minutes

// Questions per subject
const QUESTIONS_PER_SUBJECT = 40; // 4×40 = 160 for JAMB (use 40 per subject)

export interface ExamSessionClientData {
  sessionId: string;
  sessionToken: string;
  selectedSubjects: string[];
  subjectMode: string;
  durationSeconds: number;
  expiresAt: string; // ISO timestamp
  questions: ClientSafeQuestion[];
}

export interface ClientSafeQuestion {
  id: string;
  subject: string;
  year: number;
  text: string;
  options: { id: string; text: string }[];
  orderIndex: number;
  // NOTE: topic and concept helper metadata are excluded during active exam to prevent cheat hints
  topic?: string;
  concept?: string;
  // NOTE: correctOption is intentionally ABSENT — only returned after submission
}

export interface ExamSubmissionPayload {
  sessionToken: string;
  answers: Record<string, string>; // { [questionId]: "A"|"B"|"C"|"D" }
  guessedQuestions: string[];
  timeSpentSeconds: number;
}

export interface ExamResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  accuracyPct: number;
  subjectBreakdown: Record<string, { score: number; total: number; pct: number }>;
  scoredQuestions: ScoredQuestion[];
}

export interface ScoredQuestion extends ClientSafeQuestion {
  userAnswer: string | null;
  correctOption: string; // Only revealed post-submission
  isCorrect: boolean;
  wasGuessed: boolean;
  explanation: string;
  topic: string;
  concept: string;
}

/**
 * Creates a new server-side exam session.
 * Questions are randomly selected and locked. Token is cryptographically random.
 * Returns only client-safe data (no correctOption).
 */
const ENGLISH_QUESTIONS = 60;
const ELECTIVE_QUESTIONS = 40;

/**
 * Normalizes question stem text to detect and eliminate duplicate variants.
 * Strips variant markers (e.g. "[Variant 2]", "Variant 3:"), eliminates extra whitespace,
 * and converts to lowercase so minor variations map to the same canonical key.
 */
function getCanonicalQuestionStem(rawText: string): string {
  return rawText
    .replace(/^\[?\s*variant\s*\d+\s*\]?:?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Strips any developer/testing variant markers from display text
 * so candidate sees pure, clean exam text.
 */
function cleanQuestionStem(rawText: string): string {
  return rawText.replace(/^\[?\s*variant\s*\d+\s*\]?:?\s*/i, "").trim();
}

/**
 * Fisher-Yates array shuffling algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function createExamSession(
  userId: string,
  subjectMode: string,
  selectedSubjects: string[]
): Promise<ExamSessionClientData> {
  // 1. Validate subject selection
  const validSubjects = [
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

  let sanitizedSubjects = Array.from(new Set(selectedSubjects))
    .filter((s) => validSubjects.includes(s))
    .slice(0, 4);

  if (sanitizedSubjects.length === 0) {
    throw new Error("Please select at least 1 valid subject.");
  }

  // Enforce "Use of English" for full mock sessions (4 subjects) and place it first
  const isFullMock = subjectMode === "four_subjects" || sanitizedSubjects.length === 4;
  if (isFullMock) {
    const electives = sanitizedSubjects.filter((s) => s !== "Use of English").slice(0, 3);
    sanitizedSubjects = ["Use of English", ...electives];
  } else if (sanitizedSubjects.includes("Use of English")) {
    sanitizedSubjects = [
      "Use of English",
      ...sanitizedSubjects.filter((s) => s !== "Use of English"),
    ];
  }

  // Ensure the user record exists in the database to satisfy the foreign key constraint
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: `${userId}@student.prepsmart.ng`,
      name: `Student ${userId.slice(-4)}`,
    },
  });

  // 2. Parallel Database Fetching via Promise.all
  // English = exactly 60 questions; all other subjects = exactly 40 questions
  const subjectBatches = await Promise.all(
    sanitizedSubjects.map(async (subject) => {
      const requiredCount =
        subject === "Use of English" ? ENGLISH_QUESTIONS : ELECTIVE_QUESTIONS;

      // Fetch all active candidate questions for this subject
      const rawCandidates = await prisma.question.findMany({
        where: {
          subject,
          isActive: true,
        },
        select: {
          id: true,
          subject: true,
          year: true,
          text: true,
          options: true,
          topic: true,
          concept: true,
        },
      });

      // Perform rigorous deduplication using strict Sets
      // Enforces:
      // 1. Zero duplicate Question.id
      // 2. Zero duplicate Question.text / variant stems
      const shuffled = shuffleArray(rawCandidates);
      const seenIds = new Set<string>();
      const seenStems = new Set<string>();
      const uniqueQuestions: typeof rawCandidates = [];

      for (const q of shuffled) {
        if (uniqueQuestions.length >= requiredCount) break;
        if (seenIds.has(q.id)) continue;

        const canonicalStem = getCanonicalQuestionStem(q.text);
        if (seenStems.has(canonicalStem)) continue;

        // Verify options JSON is valid array
        try {
          const parsed = JSON.parse(q.options);
          if (!Array.isArray(parsed) || parsed.length < 2) continue;
        } catch {
          continue;
        }

        seenIds.add(q.id);
        seenStems.add(canonicalStem);

        uniqueQuestions.push({
          ...q,
          text: cleanQuestionStem(q.text),
        });
      }

      // Verification: Guarantee the exact required count (60 for English, 40 for electives)
      if (uniqueQuestions.length < requiredCount) {
        throw new Error(
          `Unable to generate full exam session: only ${uniqueQuestions.length} unique questions available for ${subject}, but exactly ${requiredCount} are required.`
        );
      }

      return {
        subject,
        targetLimit: requiredCount,
        questions: uniqueQuestions,
      };
    })
  );

  // 3. Assemble Contiguous Question Array with Stable Indices
  // Index 0..59 -> English (Q1-Q60)
  // Index 60..99 -> Subject 2 (Q61-Q100)
  // Index 100..139 -> Subject 3 (Q101-Q140)
  // Index 140..179 -> Subject 4 (Q141-Q180)
  const allSelectedQuestions: {
    id: string;
    subject: string;
    year: number;
    text: string;
    options: string;
    topic: string;
    concept: string;
    orderIndex: number;
  }[] = [];

  for (const batch of subjectBatches) {
    const currentOffset = allSelectedQuestions.length;
    batch.questions.forEach((q, idx) => {
      allSelectedQuestions.push({
        ...q,
        orderIndex: currentOffset + idx,
      });
    });
  }

  if (allSelectedQuestions.length === 0) {
    throw new Error("No questions available in the question bank for the selected subjects.");
  }

  // 4. Calculate Duration
  // Full 4-subject exam (180 questions) = exactly 120 minutes (7,200s).
  // Custom: English = 2,400s (40m), Electives = 1,800s (30m).
  const durationSeconds = isFullMock
    ? 7200
    : sanitizedSubjects.reduce(
        (acc, subj) => acc + (subj === "Use of English" ? 2400 : 1800),
        0
      );

  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + durationSeconds * 1000);

  // 5. Create session and all question assignments in a transaction
  const session = await prisma.examSession.create({
    data: {
      userId,
      sessionToken,
      status: "in_progress",
      subjectMode: isFullMock ? "four_subjects" : `${sanitizedSubjects.length}_subjects`,
      selectedSubjects: JSON.stringify(sanitizedSubjects),
      durationSeconds: durationSeconds,
      expiresAt,
      questions: {
        create: allSelectedQuestions.map((q) => ({
          questionId: q.id,
          orderIndex: q.orderIndex,
        })),
      },
    },
  });

  // 6. Return client-safe questions (correctOption, topic, and concept are strictly stripped)
  // During active mock exam, candidate must NOT see helper metadata hints (topic/concept)
  const clientQuestions: ClientSafeQuestion[] = allSelectedQuestions.map((q) => ({
    id: q.id,
    subject: q.subject,
    year: q.year,
    text: q.text,
    options: JSON.parse(q.options) as { id: string; text: string }[],
    orderIndex: q.orderIndex,
    // Note: topic and concept hints are intentionally excluded during active testing
  }));

  return {
    sessionId: session.id,
    sessionToken: session.sessionToken,
    selectedSubjects: sanitizedSubjects,
    subjectMode: session.subjectMode,
    durationSeconds: durationSeconds,
    expiresAt: expiresAt.toISOString(),
    questions: clientQuestions,
  };
}

/**
 * Cancels an in-progress exam session when candidate confirms exit
 */
export async function cancelExamSession(
  userId: string,
  sessionToken: string
): Promise<boolean> {
  const session = await prisma.examSession.findUnique({
    where: { sessionToken },
    select: { id: true, userId: true, status: true },
  });

  if (!session || session.userId !== userId) {
    return false;
  }

  if (session.status === "in_progress") {
    await prisma.examSession.update({
      where: { id: session.id },
      data: { status: "cancelled" },
    });
  }

  return true;
}

/**
 * Submits an exam session. All scoring happens server-side.
 *
 * Security controls:
 * 1. Validates sessionToken matches userId ownership (no other users can submit)
 * 2. Enforces server-side timer — rejects if expiresAt has passed by >120s (grace)
 * 3. Validates every submitted questionId belongs to this exact session
 * 4. Sanitizes answer values to only "A"|"B"|"C"|"D"
 * 5. Creates ExamAttempt with @@unique(sessionId) — prevents double-submission
 * 6. Saves FailedQuestion records server-side (client can never inject failures)
 */
export async function submitExamSession(
  userId: string,
  payload: ExamSubmissionPayload
): Promise<ExamResult> {
  const { sessionToken, answers, guessedQuestions, timeSpentSeconds } = payload;

  // 1. Fetch session and verify ownership
  const session = await prisma.examSession.findUnique({
    where: { sessionToken },
    include: {
      questions: {
        include: { question: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!session || session.userId !== userId) {
    // Security: return same error for not found vs wrong owner to prevent enumeration
    throw new Error("Invalid or expired exam session.");
  }

  if (session.status !== "in_progress") {
    throw new Error("This exam has already been submitted.");
  }

  // 2. Server-side timer enforcement (120s grace period for network latency)
  const serverNow = Date.now();
  const gracePeriodMs = 120_000;
  if (serverNow > session.expiresAt.getTime() + gracePeriodMs) {
    // Mark session as expired
    await prisma.examSession.update({
      where: { id: session.id },
      data: { status: "expired" },
    });
    throw new Error("Exam session has expired. Results cannot be recorded.");
  }

  // 3. Build a Set of valid question IDs for this session (anti-injection)
  const sessionQuestionIds = new Set(session.questions.map((q) => q.questionId));

  // 4. Validate and sanitize answers — only accept "A"|"B"|"C"|"D" for questions in this session
  const validOptions = new Set(["A", "B", "C", "D"]);
  const sanitizedAnswers: Record<string, string> = {};
  for (const [questionId, answer] of Object.entries(answers)) {
    if (!sessionQuestionIds.has(questionId)) continue; // Silently drop injected question IDs
    if (!validOptions.has(answer)) continue; // Drop invalid option values
    sanitizedAnswers[questionId] = answer;
  }

  // 5. Validate guessed question IDs (same whitelist check)
  const sanitizedGuessedIds = guessedQuestions.filter((id) =>
    sessionQuestionIds.has(id)
  );

  // 6. Server-side scoring — only the server knows correctOption
  const subjectBreakdown: Record<string, { score: number; total: number; pct: number }> = {};
  const failedQuestionData: { questionId: string; concept: string; topic: string }[] = [];
  const correctAnswersMap: Record<string, string> = {};
  const scoredQuestions: ScoredQuestion[] = [];

  let totalScore = 0;

  for (const esq of session.questions) {
    const q = esq.question;
    const userAnswer = sanitizedAnswers[q.id] ?? null;
    const isCorrect = userAnswer === q.correctOption;

    correctAnswersMap[q.id] = q.correctOption;

    if (!subjectBreakdown[q.subject]) {
      subjectBreakdown[q.subject] = { score: 0, total: 0, pct: 0 };
    }
    subjectBreakdown[q.subject].total++;

    if (isCorrect) {
      totalScore++;
      subjectBreakdown[q.subject].score++;
    } else {
      // Track failed questions for revision queue (server only)
      failedQuestionData.push({
        questionId: q.id,
        concept: q.concept,
        topic: q.topic,
      });
    }

    scoredQuestions.push({
      id: q.id,
      subject: q.subject,
      year: q.year,
      text: q.text,
      options: JSON.parse(q.options) as { id: string; text: string }[],
      topic: q.topic,
      concept: q.concept,
      orderIndex: esq.orderIndex,
      userAnswer,
      correctOption: q.correctOption, // Now safe to reveal
      isCorrect,
      wasGuessed: sanitizedGuessedIds.includes(q.id),
      explanation: q.explanation,
    });
  }

  // Compute per-subject percentages
  for (const subject of Object.keys(subjectBreakdown)) {
    const { score, total } = subjectBreakdown[subject];
    subjectBreakdown[subject].pct = total > 0 ? Math.round((score / total) * 100) : 0;
  }

  const totalQuestions = session.questions.length;
  const accuracyPct = totalQuestions > 0
    ? Math.round((totalScore / totalQuestions) * 10000) / 100
    : 0;

  // Clamp timeSpent to session duration (client can't lie about spending 0s)
  const clampedTimeSpent = Math.max(
    1,
    Math.min(timeSpentSeconds, session.durationSeconds)
  );

  // 7. Persist results and failed questions atomically
  const selectedSubjects: string[] = JSON.parse(session.selectedSubjects);
  const failedConceptTags = [...new Set(failedQuestionData.map((f) => f.concept))];

  const [attempt] = await prisma.$transaction([
    // Create attempt (unique sessionId prevents replay)
    prisma.examAttempt.create({
      data: {
        userId,
        sessionId: session.id,
        score: totalScore,
        totalQuestions,
        accuracyPct,
        timeSpentSeconds: clampedTimeSpent,
        subjectMode: session.subjectMode,
        selectedSubjects: JSON.stringify(selectedSubjects),
        answers: JSON.stringify(sanitizedAnswers),
        correctAnswers: JSON.stringify(correctAnswersMap), // Stored server-side for audit
        subjectBreakdown: JSON.stringify(subjectBreakdown),
        guessedQuestions: JSON.stringify(sanitizedGuessedIds),
        failedConceptTags: JSON.stringify(failedConceptTags),
      },
    }),
    // Mark session as submitted
    prisma.examSession.update({
      where: { id: session.id },
      data: { status: "submitted", submittedAt: new Date() },
    }),
  ]);

  // 8. Upsert failed questions (outside transaction, non-critical if fails)
  if (failedQuestionData.length > 0) {
    await Promise.allSettled(
      failedQuestionData.map((f) =>
        prisma.failedQuestion.upsert({
          where: { userId_questionId: { userId, questionId: f.questionId } },
          create: {
            userId,
            questionId: f.questionId,
            concept: f.concept,
            topic: f.topic,
            failedCount: 1,
            lastFailedAt: new Date(),
          },
          update: {
            failedCount: { increment: 1 },
            lastFailedAt: new Date(),
            concept: f.concept,
            topic: f.topic,
          },
        })
      )
    );
  }

  // 9. Award XP via gamification (server-side only)
  try {
    const { awardUserXP } = await import("@/lib/gamification");
    await awardUserXP(userId, "MOCK_EXAM_COMPLETED", {
      attemptId: attempt.id,
      score: totalScore,
      accuracy: accuracyPct,
    });
  } catch {
    // Non-critical — XP award failure should not block result delivery
  }

  return {
    attemptId: attempt.id,
    score: totalScore,
    totalQuestions,
    accuracyPct,
    subjectBreakdown,
    scoredQuestions,
  };
}

/**
 * Fetches scored questions for a completed attempt.
 * Validates ownership before returning. Includes correctOptions.
 */
export async function getExamResult(
  userId: string,
  attemptId: string
): Promise<ExamResult & { subjectMode: string; selectedSubjects: string[] }> {
  const attempt = await prisma.examAttempt.findUnique({
    where: { id: attemptId },
    include: {
      session: {
        include: {
          questions: {
            include: { question: true },
            orderBy: { orderIndex: "asc" },
          },
        },
      },
    },
  });

  if (!attempt || attempt.userId !== userId) {
    throw new Error("Result not found or access denied.");
  }

  const answers: Record<string, string> = JSON.parse(attempt.answers);
  const guessedIds: string[] = JSON.parse(attempt.guessedQuestions ?? "[]");
  const subjectBreakdown: Record<string, { score: number; total: number; pct: number }> =
    JSON.parse(attempt.subjectBreakdown);
  const selectedSubjects: string[] = JSON.parse(attempt.selectedSubjects);

  const scoredQuestions: ScoredQuestion[] = attempt.session.questions.map((esq) => {
    const q = esq.question;
    const userAnswer = answers[q.id] ?? null;
    const isCorrect = userAnswer === q.correctOption;
    return {
      id: q.id,
      subject: q.subject,
      year: q.year,
      text: q.text,
      options: JSON.parse(q.options) as { id: string; text: string }[],
      topic: q.topic,
      concept: q.concept,
      orderIndex: esq.orderIndex,
      userAnswer,
      correctOption: q.correctOption,
      isCorrect,
      wasGuessed: guessedIds.includes(q.id),
      explanation: q.explanation,
    };
  });

  return {
    attemptId: attempt.id,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    accuracyPct: attempt.accuracyPct,
    subjectBreakdown,
    scoredQuestions,
    subjectMode: attempt.subjectMode,
    selectedSubjects,
  };
}
