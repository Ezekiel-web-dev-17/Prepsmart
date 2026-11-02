import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { LEADERBOARD_KEY } from "@/lib/gamification";
import { getCandidateProgressData } from "@/lib/progress";
import type { RevisionQuestion } from "@/app/revision/RevisionHubClient";
import DashboardView from "./DashboardView";

export const metadata: Metadata = {
  title: "Candidate Command Center — Dashboard, Readiness & Revision Hub | PrepSmart",
  description:
    "Your unified PrepSmart candidate command center. Track your UTME countdown, daily study routine, Exam Readiness Index analytics, and spaced active recall Revision Hub all in one place.",
};

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await connection();
  const { userId: clerkUserId } = await auth();

  // If unauthenticated, redirect to sign-in
  if (!clerkUserId) {
    redirect("/sign-in");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const activeTabParam = resolvedParams.tab || "overview";

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

  // Fetch leaderboard rank, readiness analytics, and revision queue concurrently
  const [zeroRank, progressData, [totalRevisionCount, failedRecords]] = await Promise.all([
    redis.zrevrank(LEADERBOARD_KEY, clerkUserId),
    getCandidateProgressData(user.id),
    Promise.all([
      prisma.failedQuestion.count({ where: { userId: user.id } }),
      prisma.failedQuestion.findMany({
        where: { userId: user.id },
        orderBy: { lastFailedAt: "desc" },
        take: 10,
        include: {
          question: {
            select: {
              id: true,
              subject: true,
              year: true,
              text: true,
              options: true,
              topic: true,
              concept: true,
            },
          },
        },
      }),
    ]),
  ]);

  const rank = zeroRank !== null ? zeroRank + 1 : null;

  let parsedSubjects: string[] = [];
  try {
    parsedSubjects = JSON.parse(user.onboardingProfile.selectedSubjects);
  } catch {
    parsedSubjects = ["Use of English", "Mathematics", "Physics", "Chemistry"];
  }

  const initialRevisionQuestions: RevisionQuestion[] = failedRecords.map((r) => ({
    failedRecordId: r.id,
    questionId: r.question.id,
    subject: r.question.subject,
    year: r.question.year,
    text: r.question.text.replace(/^\[?\s*variant\s*\d+\s*\]?:?\s*/i, "").trim(),
    options: JSON.parse(r.question.options) as { id: string; text: string }[],
    topic: r.question.topic,
    concept: r.question.concept,
    reviewCount: r.failedCount,
    lastPracticedAt: r.lastFailedAt.toISOString(),
  }));

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
      reviewQuestionsCount={totalRevisionCount}
      progressData={progressData}
      revisionQuestions={initialRevisionQuestions}
      initialActiveTab={activeTabParam}
    />
  );
}
