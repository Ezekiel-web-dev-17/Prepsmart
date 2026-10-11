import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { LEADERBOARD_KEY } from "@/lib/gamification";
import DashboardView from "./DashboardView";

export const metadata: Metadata = {
  title: "Candidate Dashboard & Exam Command Center",
  description:
    "Your personalized PrepSmart preparation dashboard. Track your UTME countdown, daily study routine, recommended syllabus materials, and study streaks.",
};

export default async function DashboardPage() {
  await connection();
  const { userId: clerkUserId } = await auth();

  // If unauthenticated, redirect to sign-in
  if (!clerkUserId) {
    redirect("/sign-in");
  }

  // Find user and their onboarding profile
  const user = await prisma.user.findUnique({
    where: { id: clerkUserId },
    include: {
      onboardingProfile: true,
    },
  });

  // If onboarding is not completed, redirect to the onboarding wizard
  if (!user || !user.onboardingProfile || !user.onboardingProfile.completed) {
    redirect("/onboarding");
  }

  // Calculate current real-time leaderboard rank
  const zeroRank = await redis.zrevrank(LEADERBOARD_KEY, clerkUserId);
  const rank = zeroRank !== null ? zeroRank + 1 : null;

  let parsedSubjects: string[] = [];
  try {
    parsedSubjects = JSON.parse(user.onboardingProfile.selectedSubjects);
  } catch {
    parsedSubjects = ["Use of English", "Mathematics", "Physics", "Chemistry"];
  }

  return (
    <DashboardView
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        xp: user.xp,
      }}
      profile={{
        targetScore: user.onboardingProfile.targetScore,
        targetExamDate: user.onboardingProfile.targetExamDate
          ? user.onboardingProfile.targetExamDate.toISOString()
          : null,
        departmentStream: user.onboardingProfile.departmentStream,
        selectedSubjects: parsedSubjects,
        proficiencyLevel: user.onboardingProfile.proficiencyLevel,
        dailyStudyMinutes: user.onboardingProfile.dailyStudyMinutes,
        preferredStudyTime: user.onboardingProfile.preferredStudyTime,
      }}
      rank={rank}
    />
  );
}
