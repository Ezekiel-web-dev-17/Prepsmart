import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { shuffleOptions } from "@/lib/questions";

// Subject mapping helper to match DB subject casing
function mapToDbSubject(subjectSlug: string): string {
  const s = subjectSlug.toLowerCase().trim();
  if (s.includes("math") || s === "mth") return "Mathematics";
  if (s.includes("physic") || s === "phy") return "Physics";
  if (s.includes("chem") || s === "chm") return "Chemistry";
  if (s.includes("bio")) return "Biology";
  if (s.includes("english") || s === "eng") return "Use of English";
  if (s.includes("econ") || s === "eco") return "Economics";
  if (s.includes("com")) return "Commerce";
  if (s.includes("acc")) return "Principles of Accounts";
  if (s.includes("gov")) return "Government";
  if (s.includes("lit")) return "Literature in English";
  if (s.includes("cr")) return "Christian Religious Knowledge";
  return subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectParam = searchParams.get("subject") || "Mathematics";
    const topicParam = searchParams.get("topic");
    const limit = Math.max(5, Math.min(15, parseInt(searchParams.get("limit") || "10", 10)));

    const dbSubject = mapToDbSubject(subjectParam);

    let questions: Array<{
      id: string;
      subject: string;
      year: number;
      text: string;
      options: string;
      correctOption: string;
      topic: string;
      concept: string;
      explanation: string;
      mnemonic: string | null;
      diagramSvg: string | null;
      difficulty: string;
    }> = [];

    // 1. Try to find questions strictly matching the topic first
    if (topicParam) {
      questions = await prisma.question.findMany({
        where: {
          isActive: true,
          subject: { equals: dbSubject, mode: "insensitive" },
          OR: [
            { topic: { contains: topicParam, mode: "insensitive" } },
            { concept: { contains: topicParam, mode: "insensitive" } },
            { text: { contains: topicParam, mode: "insensitive" } },
          ],
        },
        take: limit,
      });
    }

    // 2. If fewer than requested limit, supplement with questions from the same subject
    if (questions.length < limit) {
      const existingIds = questions.map((q) => q.id);
      const remainingLimit = limit - questions.length;

      const fallbackQuestions = await prisma.question.findMany({
        where: {
          isActive: true,
          subject: { equals: dbSubject, mode: "insensitive" },
          id: { notIn: existingIds },
        },
        take: remainingLimit,
      });

      questions = [...questions, ...fallbackQuestions];
    }

    // 3. If still fewer (e.g. commercial or arts subject with sparse bank), get any active questions
    if (questions.length < 5) {
      const existingIds = questions.map((q) => q.id);
      const generalFallback = await prisma.question.findMany({
        where: {
          isActive: true,
          id: { notIn: existingIds },
        },
        take: limit - questions.length,
      });
      questions = [...questions, ...generalFallback];
    }

    // 4. Format and shuffle options
    const formatted = questions.map((q) => {
      const shuffled = shuffleOptions({
        ...q,
        options: q.options,
        correctOption: q.correctOption,
      });

      let optionsList = [];
      try {
        optionsList = typeof shuffled.options === "string" ? JSON.parse(shuffled.options) : shuffled.options;
      } catch {
        optionsList = [];
      }

      return {
        id: q.id,
        subject: q.subject,
        year: q.year,
        text: q.text,
        options: optionsList,
        correctOption: shuffled.correctOption,
        topic: q.topic,
        concept: q.concept,
        explanation: q.explanation,
        mnemonic: q.mnemonic,
        diagramSvg: q.diagramSvg,
        difficulty: q.difficulty,
      };
    });

    return NextResponse.json({
      subject: dbSubject,
      topic: topicParam || "General",
      count: formatted.length,
      questions: formatted,
    });
  } catch (error: unknown) {
    console.error("Error fetching topic quiz questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic quiz questions" },
      { status: 500 }
    );
  }
}
