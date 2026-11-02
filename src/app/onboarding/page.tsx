import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Candidate Onboarding & Personal Study Plan",
  description:
    "Set your target JAMB score, select your academic stream and 4 UTME subjects, customize your daily study cadence, and activate streak protection reminders.",
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/onboarding");
  }

  return (
    <div className="py-4 sm:py-6">
      <Suspense fallback={<div className="h-96 rounded-3xl bg-muted/40 animate-pulse" />}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
