import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { LEADERBOARD_KEY } from "./gamification";

export type DuolingoLeagueTier =
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Sapphire"
  | "Ruby"
  | "Emerald"
  | "Amethyst"
  | "Pearl"
  | "Obsidian"
  | "Diamond";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image: string | null;
  xp: number;
  tier: DuolingoLeagueTier;
  stream: "science" | "commercial" | "arts";
  streakDays: number;
  targetScore: number;
  role: string;
  isCurrentUser?: boolean;
}

export function getTierForXp(xp: number): DuolingoLeagueTier {
  if (xp >= 2800) return "Diamond";
  if (xp >= 2250) return "Obsidian";
  if (xp >= 1750) return "Pearl";
  if (xp >= 1350) return "Amethyst";
  if (xp >= 1000) return "Emerald";
  if (xp >= 750) return "Ruby";
  if (xp >= 500) return "Sapphire";
  if (xp >= 300) return "Gold";
  if (xp >= 150) return "Silver";
  return "Bronze";
}

/**
 * Retrieves ranked students with complete Duolingo-style gamification attributes.
 * Hydrates candidate profiles, study stream, active streak, and target scores.
 */
export async function getTopLeaderboard(
  limit = 50,
  currentUserId?: string
): Promise<LeaderboardEntry[]> {
  try {
    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { xp: "desc" },
      include: {
        onboardingProfile: {
          select: {
            departmentStream: true,
            targetScore: true,
            selectedSubjects: true,
          },
        },
        xpHistory: {
          select: {
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 15,
        },
      },
    });

    if (users.length > 0) {
      // Sync to redis non-blockingly
      Promise.all(
        users.map((u) => redis.zadd(LEADERBOARD_KEY, u.xp, u.id))
      ).catch(() => {});

      return users.map((user, index) => {
        const stream =
          (user.onboardingProfile?.departmentStream as
            | "science"
            | "commercial"
            | "arts") || "science";
        const targetScore = user.onboardingProfile?.targetScore || 280;

        // Calculate distinct active streak days from activity records
        const activeDates = new Set<string>();
        for (const record of user.xpHistory) {
          activeDates.add(record.createdAt.toISOString().split("T")[0]);
        }
        const streakDays = Math.max(1, activeDates.size);

        return {
          rank: index + 1,
          userId: user.id,
          name: user.name || `Candidate ${user.id.slice(-4)}`,
          image: user.image || null,
          xp: user.xp,
          tier: getTierForXp(user.xp),
          stream,
          streakDays,
          targetScore,
          role: user.role || "candidate",
          isCurrentUser: currentUserId ? user.id === currentUserId : false,
        };
      });
    }
  } catch (error) {
    console.warn("Database leaderboard fetch error, using fallback:", error);
  }

  return [];
}
