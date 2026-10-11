import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Roster",
  description: "Manage registered student profiles, switch active candidate, and export cohort performance reports.",
};

export default function RosterPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h1 className="text-2xl font-bold text-foreground">Student Roster & Cohort Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Switch active candidate profile, add new candidates, and export cohort diagnostic reports.
        </p>
      </div>
    </div>
  );
}
