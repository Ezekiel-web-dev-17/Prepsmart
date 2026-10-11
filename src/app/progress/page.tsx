import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Progress & Readiness",
  description: "Track your JAMB syllabus completion, mastery score, and projected UTME points.",
};

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h1 className="text-2xl font-bold text-foreground">Progress & UTME Readiness</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed metrics across subjects, diagnostic score progression, weak topics queue, and cohort export options.
        </p>
      </div>
    </div>
  );
}
