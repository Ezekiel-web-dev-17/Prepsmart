import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Onboarding & Diagnostic Test",
  description: "Set up your student profile, target score, departmental stream, and complete your diagnostic baseline test.",
};

export default function OnboardingPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h1 className="text-2xl font-bold text-foreground">Candidate Onboarding</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personalize your 4-week preparation plan by setting target scores, course goals, and taking the diagnostic baseline test.
        </p>
      </div>
    </div>
  );
}
