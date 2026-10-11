import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revision Hub",
  description: "High-yield flashcards, formula cheatsheets, and active recall decks for JAMB/UTME.",
};

export default function RevisionPage() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <h1 className="text-2xl font-bold text-foreground">Revision Hub & Active Recall</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review high-yield flashcards, formulae, mnemonics, and concepts flagged for revision.
        </p>
      </div>
    </div>
  );
}
