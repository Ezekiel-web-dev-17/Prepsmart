import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const REVISION_BATCH_SIZE = 10;

// GET /api/mock-exam/revision — fetch a batch of questions for revision
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const batch = Math.max(1, parseInt(searchParams.get("batch") || searchParams.get("page") || "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (batch - 1) * limit;

    const totalRecords = await prisma.failedQuestion.count({ where: { userId } });

    const reviewRecords = await prisma.failedQuestion.findMany({
      where: { userId },
      orderBy: { lastFailedAt: "desc" },
      skip,
      take: limit,
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
            // correctOption intentionally excluded — revealed only after submission
          },
        },
      },
    });

    const questions = reviewRecords.map((r) => ({
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

    return NextResponse.json({
      questions,
      totalQuestions: totalRecords,
      totalReview: totalRecords,
      totalFailed: totalRecords, // backward compatibility
      batch,
      hasMore: batch * limit < totalRecords,
    });
  } catch (err) {
    console.error("[revision/GET] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const AnswerSchema = z.object({
  questionId: z.string().min(1).max(50),
  selectedOption: z.enum(["A", "B", "C", "D"]),
});

// POST /api/mock-exam/revision — validate a revision answer server-side
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = AnswerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { questionId, selectedOption } = parsed.data;

    // Verify the record belongs to this user
    const record = await prisma.failedQuestion.findFirst({
      where: { userId, questionId },
      include: {
        question: {
          select: {
            id: true,
            correctOption: true,
            explanation: true,
            concept: true,
            topic: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Question not in your revision queue" }, { status: 404 });
    }

    const isCorrect = selectedOption === record.question.correctOption;

    if (isCorrect) {
      // Successfully mastered — remove from revision queue
      await prisma.failedQuestion.delete({ where: { id: record.id } });

      // Award XP for concept mastery
      try {
        const { awardUserXP } = await import("@/lib/gamification");
        await awardUserXP(userId, "QUESTION_ANSWERED", {
          concept: record.concept,
          source: "revision_hub",
        });
      } catch {
        // Non-critical
      }
    } else {
      // Needs further review — update timestamp
      await prisma.failedQuestion.update({
        where: { id: record.id },
        data: { failedCount: { increment: 1 }, lastFailedAt: new Date() },
      });
    }

    return NextResponse.json({
      isCorrect,
      correctOption: record.question.correctOption,
      explanation: record.question.explanation,
      message: isCorrect
        ? "Mastered! ✨ Excellent work locking down this concept."
        : "Not quite yet! You're learning every time. Review the examiner rationale below to lock in the principle.",
    });
  } catch (err) {
    console.error("[revision/POST] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
