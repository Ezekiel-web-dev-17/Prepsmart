import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { LEADERBOARD_KEY } from "./gamification";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  xp: number;
  tier: "Emerald" | "Diamond" | "Gold" | "Silver" | "Bronze";
}

export function getTierForXp(xp: number): LeaderboardEntry["tier"] {
  if (xp >= 1000) return "Emerald";
  if (xp >= 600) return "Diamond";
  if (xp >= 350) return "Gold";
  if (xp >= 150) return "Silver";
  return "Bronze";
}

/**
 * Retrieves the Top 50 ranked students.
 * Reads from Redis Sorted Set for fast reads, then hydrates user profiles from PostgreSQL.
 */
export async function getTopLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  // 1. Fetch top member IDs and scores from Redis
  let redisEntries = await redis.zrevrangeWithScores(LEADERBOARD_KEY, 0, limit - 1);

  // Fallback or dev sync: If Redis is empty or has fewer entries than DB in development, hydrate from DB
  if (redisEntries.length === 0 || (redisEntries.length < 5 && process.env.NODE_ENV !== "production")) {
    const topUsers = await prisma.user.findMany({
      take: limit,
      orderBy: { xp: "desc" },
      select: { id: true, name: true, image: true, xp: true },
    });

    if (topUsers.length > 0) {
      await Promise.all(
        topUsers.map((u) => redis.zadd(LEADERBOARD_KEY, u.xp, u.id))
      ).catch((err) => console.warn("Redis backfill error:", err));
      redisEntries = await redis.zrevrangeWithScores(LEADERBOARD_KEY, 0, limit - 1);
    }
  }

  if (redisEntries.length > 0) {
    const userIds = redisEntries.map((e) => e.member);

    // 2. Hydrate user profiles in a single query
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true, xp: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return redisEntries.map((entry, index) => {
      const profile = userMap.get(entry.member);
      const xp = profile?.xp ?? entry.score;
      return {
        rank: index + 1,
        userId: entry.member,
        name: profile?.name || `Student ${entry.member.slice(-4)}`,
        image: profile?.image || null,
        xp,
        tier: getTierForXp(xp),
      };
    });
  }

  // Final fallback if both redis and previous sync produced no entries
  const fallbackUsers = await prisma.user.findMany({
    take: limit,
    orderBy: { xp: "desc" },
    select: { id: true, name: true, image: true, xp: true },
  });

  return fallbackUsers.map((user, idx) => ({
    rank: idx + 1,
    userId: user.id,
    name: user.name || `Student ${user.id.slice(-4)}`,
    image: user.image || null,
    xp: user.xp,
    tier: getTierForXp(user.xp),
  }));
}
