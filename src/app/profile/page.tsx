import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Profile & Diagnostic Report",
  description: "Review your baseline readiness score, subject strength breakdown, and target institution roadmap.",
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h1 className="text-2xl font-bold text-foreground">Diagnostic Readiness Report</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review your baseline test results, projected score gains, and targeted syllabus recommendations.
        </p>
      </div>
    </div>
  );
}
