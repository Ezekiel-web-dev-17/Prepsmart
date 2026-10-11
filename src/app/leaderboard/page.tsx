import type { Metadata } from "next";
import { connection } from "next/server";
import { getTopLeaderboard } from "@/lib/leaderboard";
import LeaderboardView from "./LeaderboardView";

export const metadata: Metadata = {
  title: "Real-Time Leaderboard & Gamification Ranking",
  description:
    "Check the top 50 JAMB candidates on PrepSmart. Earn XP through topic mastery, diagnostic pre-tests, and active recall to climb the global leaderboard.",
  keywords: [
    "JAMB Leaderboard",
    "PrepSmart Gamification",
    "Real-time Ranking",
    "Study Streak",
    "UTME Top Scores",
  ],
};

export default async function LeaderboardPage() {
  await connection();
  const leaderboard = await getTopLeaderboard(50);

  return <LeaderboardView initialEntries={leaderboard} />;
}
