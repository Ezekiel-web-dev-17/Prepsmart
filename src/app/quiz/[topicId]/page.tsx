import type { Metadata } from "next";

export const instant = false;

type Props = {
  params: Promise<{ topicId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params;
  return {
    title: `Practice CBT Drill: ${topicId}`,
    description: `Timed CBT practice test with instant rationale and mastery analysis.`,
  };
}

export default async function QuizPage({ params }: Props) {
  const { topicId } = await params;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs transition-colors duration-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
          <span>JAMB CBT Practice Drill</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mt-1">Topic Drill: {topicId}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Timed UTME exam simulation with multiple choice options, instant feedback, and detailed explanations.
        </p>
      </div>
    </div>
  );
}
