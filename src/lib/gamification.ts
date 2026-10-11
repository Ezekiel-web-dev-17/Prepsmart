import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export type XpEventType =
  | "TOPIC_COMPLETED"
  | "QUESTION_ANSWERED"
  | "DIAGNOSTIC_COMPLETED"
  | "DAILY_STREAK"
  | "MOCK_EXAM_COMPLETED";

export const XP_RULES: Record<XpEventType, number> = {
  QUESTION_ANSWERED: 5, // +5 XP per question answered correctly
  TOPIC_COMPLETED: 50, // +50 XP for finishing a syllabus topic
  DAILY_STREAK: 25, // +25 XP for checking in daily
  DIAGNOSTIC_COMPLETED: 100, // +100 XP for completing onboarding pre-test
  MOCK_EXAM_COMPLETED: 150, // +150 XP for completing a timed mock exam
};

export const LEADERBOARD_KEY = "leaderboard:global";

export interface AwardXpResult {
  success: boolean;
  pointsAwarded: number;
  newTotalXp: number;
  rank: number | null;
  eventType: XpEventType;
}

/**
 * Awards XP to a user with dual persistence:
 * 1. Atomically increments XP and creates audit record in PostgreSQL via Prisma.
 * 2. Immediately updates score in Redis Sorted Set (leaderboard:global) for real-time ranking.
 */
export async function awardUserXP(
  userId: string,
  eventType: XpEventType,
  metadata?: Record<string, unknown>
): Promise<AwardXpResult> {
  const points = XP_RULES[eventType];
  if (!points || points <= 0) {
    throw new Error(`Invalid event type or zero points defined for: ${eventType}`);
  }

  // Ensure user exists or create placeholder if anonymous/test
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, xp: true },
  });

  let updatedUser: { id: string; xp: number };

  if (!existingUser) {
    // Upsert or create user with initial points
    updatedUser = await prisma.user.create({
      data: {
        id: userId,
        email: `${userId}@student.prepsmart.ng`,
        name: `Student ${userId.slice(-4)}`,
        xp: points,
      },
      select: { id: true, xp: true },
    });

    await prisma.xpHistory.create({
      data: {
        userId,
        eventType,
        pointsAwarded: points,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } else {
    // 1. PostgreSQL Atomic Transaction
    const [user] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: points } },
        select: { id: true, xp: true },
      }),
      prisma.xpHistory.create({
        data: {
          userId,
          eventType,
          pointsAwarded: points,
          metadata: metadata ? JSON.stringify(metadata) : null,
        },
      }),
    ]);
    updatedUser = user;
  }

  // 2. Real-Time Redis Sorted Set Update
  await redis.zadd(LEADERBOARD_KEY, updatedUser.xp, userId);

  // 3. Fetch 1-indexed global rank
  const zeroRank = await redis.zrevrank(LEADERBOARD_KEY, userId);
  const userRank = zeroRank !== null ? zeroRank + 1 : null;

  return {
    success: true,
    pointsAwarded: points,
    newTotalXp: updatedUser.xp,
    rank: userRank,
    eventType,
  };
}

/**
 * Get current stats and rank for a specific user
 */
export async function getUserGamificationStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, xp: true, image: true },
  });

  const zeroRank = await redis.zrevrank(LEADERBOARD_KEY, userId);
  const rank = zeroRank !== null ? zeroRank + 1 : null;

  return {
    user,
    xp: user?.xp ?? 0,
    rank,
  };
}
