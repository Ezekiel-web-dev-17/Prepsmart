import { Suspense } from "react";
import type { Metadata } from "next";
import OnboardingWizard from "./OnboardingWizard";

export const metadata: Metadata = {
  title: "Candidate Onboarding & Personal Study Plan",
  description:
    "Set your target JAMB score, select your academic stream and 4 UTME subjects, customize your daily study cadence, and activate streak protection reminders.",
};

export default function OnboardingPage() {
  return (
    <div className="py-4 sm:py-6">
      <Suspense fallback={<div className="h-96 rounded-3xl bg-muted/40 animate-pulse" />}>
        <OnboardingWizard />
      </Suspense>
    </div>
  );
}
