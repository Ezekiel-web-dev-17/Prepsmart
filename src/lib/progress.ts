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
    // If no questions attempted yet in this subject, set baseline onboarding mastery (60%)
    let pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 60;
    pct = Math.min(100, Math.max(15, pct));

    let status: SubjectMasteryItem["status"] = "Building Momentum";
    if (pct >= 80) status = "Mastery Level";
    else if (pct >= 65) status = "On Track";

    return {
      subject: subj,
      masteryPct: pct,
      questionsAttempted: stats.total,
      masteredCount: stats.correct,
      status,
    };
  });

  // 5. Calculate Exam Readiness Score (0 - 100%)
  const totalMocks = examAttempts.length;
  const totalDrills = xpLogs.filter((l) => l.eventType === "TOPIC_COMPLETED").length;

  let averageMockAccuracy = 0;
  if (totalMocks > 0) {
    const sumAccuracy = examAttempts.reduce((acc, curr) => acc + curr.accuracyPct, 0);
    averageMockAccuracy = sumAccuracy / totalMocks;
  }

  const averageSubjectMastery =
    subjectMastery.reduce((acc, curr) => acc + curr.masteryPct, 0) /
    (subjectMastery.length || 1);

  // Practice habit factor (streak + drills completed + XP milestones)
  const habitFactor = Math.min(
    100,
    activeStreak * 14 + totalDrills * 10 + Math.min(user.xp / 15, 30)
  );

  let examReadinessScore = 0;
  if (totalMocks > 0) {
    examReadinessScore = Math.round(
      averageMockAccuracy * 0.5 + averageSubjectMastery * 0.3 + habitFactor * 0.2
    );
  } else {
    // Before full mock exam, readiness draws from drills and syllabus coverage
    examReadinessScore = Math.round(averageSubjectMastery * 0.65 + habitFactor * 0.35);
  }
  // Keep clamped to a realistic, encouraging score
  examReadinessScore = Math.min(99, Math.max(20, examReadinessScore));

  // 6. Aggregate Top 3 Concepts to Review (strictly positive phrasing)
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
    .slice(0, 3);

  let conceptsToReview: ConceptToReviewItem[] = sortedConcepts.map((c) => ({
    concept: c.concept,
    topic: c.topic,
    subject: c.subject,
    reviewCount: c.count,
  }));

  // Fallback high-yield concepts if candidate has completed all active review items
  if (conceptsToReview.length === 0) {
    conceptsToReview = [
      {
        concept: "Oral Forms & Stress Patterns",
        topic: "Phonology & Lexis",
        subject: "Use of English",
        reviewCount: 0,
      },
      {
        concept: "Differential Calculus & Tangents",
        topic: "Calculus",
        subject: "Mathematics",
        reviewCount: 0,
      },
      {
        concept: "Electrolysis & Faraday's Laws",
        topic: "Physical Chemistry",
        subject: "Chemistry",
        reviewCount: 0,
      },
    ];
  }

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
function calculateActiveStreak(
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
