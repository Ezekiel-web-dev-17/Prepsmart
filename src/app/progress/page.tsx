import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCandidateProgressData } from "@/lib/progress";
import { ProgressDashboardClient } from "./ProgressDashboardClient";

export const metadata: Metadata = {
  title: "Exam Readiness & Progress Analytics | PrepSmart",
  description:
    "Track your JAMB UTME readiness index, subject mastery scores, active study streak, and high-yield concepts to review.",
};

export default async function ProgressPage() {
  await connection();
  const { userId } = await auth();

  // Redirect unauthenticated visitors to sign in
  if (!userId) {
    redirect("/sign-in");
  }

  const progressData = await getCandidateProgressData(userId);

  // If user profile does not exist or onboarding has not been done, guide them to onboarding
  if (!progressData) {
    redirect("/onboarding");
  }

  return <ProgressDashboardClient data={progressData} />;
}
