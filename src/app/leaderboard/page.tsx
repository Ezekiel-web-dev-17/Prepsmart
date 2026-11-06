import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
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

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  await connection();
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/leaderboard");
  }

  const leaderboard = await getTopLeaderboard(50, userId);

  return <LeaderboardView initialEntries={leaderboard} currentUserId={userId} />;
}
