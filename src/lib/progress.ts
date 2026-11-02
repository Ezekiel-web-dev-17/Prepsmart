import "server-only";
import { prisma } from "@/lib/prisma";

export interface SubjectMasteryItem {
  subject: string;
  masteryPct: number;
  questionsAttempted: number;
  masteredCount: number;
  status: "Mastery Level" | "On Track" | "Building Momentum";
}

export interface ConceptToReviewItem {
  concept: string;
  topic: string;
  subject: string;
  reviewCount: number;
}

export interface CandidateProgressData {
  user: {
    id: string;
    name: string | null;
    email: string;
    xp: number;
  };
  targetScore: number;
  examReadinessScore: number;
  activeStreak: number;
  subjectMastery: SubjectMasteryItem[];
  conceptsToReview: ConceptToReviewItem[];
  weeklyQuestionsCount: number;
  totalMocksCompleted: number;
  totalDrillsCompleted: number;
  motivationalMessage: string;
}

/**
 * Aggregates candidate assessment data, mock exams, practice history,
 * and review queue to calculate Exam Readiness and Subject Mastery.
 */
export async function getCandidateProgressData(
  userId: string
): Promise<CandidateProgressData | null> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // 1. Fetch candidate profile, exam attempts, XP history, and revision queue concurrently
  const [user, examAttempts, xpLogs, recentWeeklyXp, failedRecords] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: { onboardingProfile: true },
      }),

      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          score: true,
          totalQuestions: true,
          accuracyPct: true,
          subjectBreakdown: true,
          createdAt: true,
        },
      }),

      prisma.xpHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { eventType: true, createdAt: true, pointsAwarded: true },
      }),

      prisma.xpHistory.findMany({
        where: {
          userId,
          createdAt: { gte: oneWeekAgo },
        },
        select: { eventType: true, pointsAwarded: true },
      }),

      prisma.failedQuestion.findMany({
        where: { userId },
        orderBy: [{ failedCount: "desc" }, { lastFailedAt: "desc" }],
        include: {
          question: {
            select: {
              subject: true,
              topic: true,
              concept: true,
            },
          },
        },
      }),
    ]);

  if (!user) {
    return null;
  }

  // 2. Parse selected subjects from onboarding profile or fallback to core 4
  let selectedSubjects: string[] = [];
  if (user.onboardingProfile?.selectedSubjects) {
    try {
      selectedSubjects = JSON.parse(user.onboardingProfile.selectedSubjects);
    } catch {
      selectedSubjects = ["Use of English", "Mathematics", "Physics", "Chemistry"];
    }
  } else {
    selectedSubjects = ["Use of English", "Mathematics", "Physics", "Chemistry"];
  }

  // 3. Compute Active Study Streak (consecutive days of practice)
  const activeStreak = calculateActiveStreak(
    xpLogs.map((log) => log.createdAt),
    examAttempts.map((attempt) => attempt.createdAt)
  );

  // 4. Calculate Subject Mastery Breakdown
  const subjectStats: Record<string, { correct: number; total: number }> = {};
  for (const subj of selectedSubjects) {
    subjectStats[subj] = { correct: 0, total: 0 };
  }

  // Aggregate questions per subject across all mock exams
  for (const attempt of examAttempts) {
    try {
      const breakdown = JSON.parse(attempt.subjectBreakdown) as Record<
        string,
        { score: number; total: number }
      >;
      for (const [subj, data] of Object.entries(breakdown)) {
        if (!subjectStats[subj]) {
          subjectStats[subj] = { correct: 0, total: 0 };
        }
        subjectStats[subj].correct += data.score;
        subjectStats[subj].total += data.total;
      }
    } catch {
      // Continue safely if breakdown format varies
    }
  }

  const subjectMastery: SubjectMasteryItem[] = selectedSubjects.map((subj) => {
    const stats = subjectStats[subj] || { correct: 0, total: 0 };
    // Real recorded data: 0% if no questions attempted yet
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

    let status: SubjectMasteryItem["status"] = "Building Momentum";
    if (stats.total === 0) {
      status = "Building Momentum";
    } else if (pct >= 80) {
      status = "Mastery Level";
    } else if (pct >= 60) {
      status = "On Track";
    }

    return {
      subject: subj,
      masteryPct: pct,
      questionsAttempted: stats.total,
      masteredCount: stats.correct,
      status,
    };
  });

  // 5. Calculate Real Recorded Exam Readiness Score (0 - 100%)
  const totalMocks = examAttempts.length;
  const totalDrills = xpLogs.filter((l) => l.eventType === "TOPIC_COMPLETED").length;
  const totalQuestionsAttempted = Object.values(subjectStats).reduce(
    (sum, s) => sum + s.total,
    0
  );
  const totalQuestionsCorrect = Object.values(subjectStats).reduce(
    (sum, s) => sum + s.correct,
    0
  );

  let examReadinessScore = 0;
  if (totalQuestionsAttempted > 0) {
    const rawAccuracy = (totalQuestionsCorrect / totalQuestionsAttempted) * 100;
    const streakBonus = Math.min(10, activeStreak * 2);
    const volumeFactor = Math.min(15, Math.round((totalQuestionsAttempted / 180) * 15));
    examReadinessScore = Math.min(
      100,
      Math.max(5, Math.round(rawAccuracy * 0.75 + volumeFactor + streakBonus))
    );
  } else if (totalDrills > 0 || user.xp > 0) {
    // Some drills or XP logged but no full exam sessions
    examReadinessScore = Math.min(35, Math.round(totalDrills * 5 + Math.min(user.xp / 50, 15)));
  } else {
    // Brand new user: 0% real readiness until assessments are completed
    examReadinessScore = 0;
  }

  // 6. Aggregate Real Recorded Concepts to Review from Error Log
  const conceptMap = new Map<
    string,
    { concept: string; topic: string; subject: string; count: number }
  >();

  for (const record of failedRecords) {
    const key = `${record.question.subject}:::${record.concept}`;
    if (!conceptMap.has(key)) {
      conceptMap.set(key, {
        concept: record.concept,
        topic: record.topic,
        subject: record.question.subject,
        count: record.failedCount,
      });
    } else {
      const existing = conceptMap.get(key)!;
      existing.count += record.failedCount;
    }
  }

  const sortedConcepts = Array.from(conceptMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Return strictly real recorded concepts (NO fake fallback concepts!)
  const conceptsToReview: ConceptToReviewItem[] = sortedConcepts.map((c) => ({
    concept: c.concept,
    topic: c.topic,
    subject: c.subject,
    reviewCount: c.count,
  }));

  // 7. Calculate Weekly Question Count
  const weeklyQuestionLogs = recentWeeklyXp.filter(
    (l) => l.eventType === "QUESTION_ANSWERED"
  ).length;

  const weeklyMockQuestions = examAttempts
    .filter((a) => a.createdAt >= oneWeekAgo)
    .reduce((sum, a) => sum + a.totalQuestions, 0);

  const weeklyQuestionsCount = weeklyQuestionLogs + weeklyMockQuestions;

  // 8. Positive UX Motivational Microcopy
  let motivationalMessage =
    "You're making steady headway. Consistent daily practice is your proven path to a high UTME score!";
  if (weeklyQuestionsCount >= 100) {
    motivationalMessage = `You've conquered ${weeklyQuestionsCount} questions this week. Your consistency is paying off!`;
  } else if (weeklyQuestionsCount > 0) {
    motivationalMessage = `You've completed ${weeklyQuestionsCount} questions this week. Keep this solid study rhythm going!`;
  } else if (activeStreak >= 3) {
    motivationalMessage = `Impressive ${activeStreak}-day study streak! You're cementing high-yield concepts every single day.`;
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      xp: user.xp,
    },
    targetScore: user.onboardingProfile?.targetScore || 280,
    examReadinessScore,
    activeStreak,
    subjectMastery,
    conceptsToReview,
    weeklyQuestionsCount,
    totalMocksCompleted: totalMocks,
    totalDrillsCompleted: totalDrills,
    motivationalMessage,
  };
}

/**
 * Calculates continuous consecutive active calendar days
 */
export function calculateActiveStreak(
  xpDates: Date[],
  examDates: Date[]
): number {
  const allDates = [...xpDates, ...examDates];
  if (allDates.length === 0) return 0;

  const dateStrings = new Set<string>();
  for (const date of allDates) {
    dateStrings.add(date.toISOString().split("T")[0]);
  }

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let currentStreak = 0;
  let checkDate = new Date();

  // If candidate was active today, count from today; if not yet today, start from yesterday
  if (dateStrings.has(todayStr)) {
    checkDate = today;
  } else if (dateStrings.has(yesterdayStr)) {
    checkDate = yesterday;
  } else {
    return 0; // Streak broken
  }

  while (true) {
    const key = checkDate.toISOString().split("T")[0];
    if (dateStrings.has(key)) {
      currentStreak++;
      // Step back one calendar day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return currentStreak;
}
