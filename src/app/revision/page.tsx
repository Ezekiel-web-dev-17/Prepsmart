import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import RevisionHubClient, { type RevisionQuestion } from "./RevisionHubClient";

export const metadata: Metadata = {
  title: "Revision Hub & Concept Mastery | PrepSmart",
  description:
    "Review your previous practice and master these concepts! Spaced active recall and step-by-step examiner solutions for JAMB CBT.",
};

export const instant = false;

export default async function RevisionPage() {
  await connection();
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch initial batch of questions in the user's revision queue
  const [totalCount, failedRecords] = await Promise.all([
    prisma.failedQuestion.count({ where: { userId } }),
    prisma.failedQuestion.findMany({
      where: { userId },
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
  ]);

  const initialQuestions: RevisionQuestion[] = failedRecords.map((r) => ({
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
    <RevisionHubClient
      initialQuestions={initialQuestions}
      initialTotal={totalCount}
    />
  );
}
