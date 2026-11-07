import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  generateCalculationVariant,
  TopicRevisionGroup,
  TopicRevisionQuestion,
} from "@/lib/revision-generator";

// GET /api/mock-exam/revision — fetch revision questions (supports flat batch or per-topic grouping)
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get("view"); // "topics" | "flat"
    const batch = Math.max(1, parseInt(searchParams.get("batch") || searchParams.get("page") || "1", 10));
    const limit = Math.min(20, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const skip = (batch - 1) * limit;

    const totalRecords = await prisma.failedQuestion.count({ where: { userId } });

    // ── 1. TOPIC-ORGANIZED REVISION (3 QUESTIONS PER TOPIC) ──
    if (view === "topics") {
      const allFailed = await prisma.failedQuestion.findMany({
        where: { userId },
        orderBy: [{ failedCount: "desc" }, { lastFailedAt: "desc" }],
        include: {
          question: true,
        },
      });

      // Group failed records by topic and subject
      const topicMap = new Map<
        string,
        {
          topic: string;
          subject: string;
          concept: string;
          failedCount: number;
          records: typeof allFailed;
        }
      >();

      for (const record of allFailed) {
        const key = `${record.question.subject}:::${record.question.topic}`;
        if (!topicMap.has(key)) {
          topicMap.set(key, {
            topic: record.question.topic,
            subject: record.question.subject,
            concept: record.question.concept,
            failedCount: record.failedCount,
            records: [record],
          });
        } else {
          const entry = topicMap.get(key)!;
          entry.failedCount += record.failedCount;
          entry.records.push(record);
        }
      }

      const topicGroups: TopicRevisionGroup[] = [];

      for (const [, group] of topicMap.entries()) {
        const firstRecord = group.records[0];
        const baseQuestion = firstRecord.question;

        let parsedOptions: { id: string; text: string }[] = [];
        try {
          parsedOptions = JSON.parse(baseQuestion.options);
        } catch {
          parsedOptions = [];
        }

        const questionsForTopic: TopicRevisionQuestion[] = [];

        // Question 1: The original failed question
        questionsForTopic.push({
          id: baseQuestion.id,
          sourceQuestionId: baseQuestion.id,
          failedRecordId: firstRecord.id,
          subject: baseQuestion.subject,
          topic: baseQuestion.topic,
          concept: baseQuestion.concept,
          year: baseQuestion.year,
          text: baseQuestion.text.replace(/^\[?\s*variant\s*\d+\s*\]?:?\s*/i, "").trim(),
          options: parsedOptions,
          correctOption: baseQuestion.correctOption,
          explanation: baseQuestion.explanation,
          mnemonic: baseQuestion.mnemonic,
          diagramSvg: baseQuestion.diagramSvg,
          isVariant: false,
        });

        // Search for sibling questions from DB on this exact topic
        const siblingQuestions = await prisma.question.findMany({
          where: {
            subject: { equals: baseQuestion.subject, mode: "insensitive" },
            topic: { contains: baseQuestion.topic, mode: "insensitive" },
            id: { not: baseQuestion.id },
            isActive: true,
          },
          take: 2,
        });

        // Add sibling 1 or isomorphic variant 1
        if (siblingQuestions[0]) {
          let sibOptions = [];
          try {
            sibOptions = JSON.parse(siblingQuestions[0].options);
          } catch {
            sibOptions = [];
          }
          questionsForTopic.push({
            id: siblingQuestions[0].id,
            sourceQuestionId: siblingQuestions[0].id,
            subject: siblingQuestions[0].subject,
            topic: siblingQuestions[0].topic,
            concept: siblingQuestions[0].concept,
            year: siblingQuestions[0].year,
            text: siblingQuestions[0].text,
            options: sibOptions,
            correctOption: siblingQuestions[0].correctOption,
            explanation: siblingQuestions[0].explanation,
            mnemonic: siblingQuestions[0].mnemonic,
            diagramSvg: siblingQuestions[0].diagramSvg,
            isVariant: true,
            variantIndex: 1,
          });
        } else {
          questionsForTopic.push(
            generateCalculationVariant(
              {
                id: baseQuestion.id,
                subject: baseQuestion.subject,
                topic: baseQuestion.topic,
                concept: baseQuestion.concept,
                text: baseQuestion.text,
                options: parsedOptions,
                correctOption: baseQuestion.correctOption,
                explanation: baseQuestion.explanation,
                mnemonic: baseQuestion.mnemonic,
                diagramSvg: baseQuestion.diagramSvg,
              },
              1
            )
          );
        }

        // Add sibling 2 or isomorphic variant 2
        if (siblingQuestions[1]) {
          let sibOptions2 = [];
          try {
            sibOptions2 = JSON.parse(siblingQuestions[1].options);
          } catch {
            sibOptions2 = [];
          }
          questionsForTopic.push({
            id: siblingQuestions[1].id,
            sourceQuestionId: siblingQuestions[1].id,
            subject: siblingQuestions[1].subject,
            topic: siblingQuestions[1].topic,
            concept: siblingQuestions[1].concept,
            year: siblingQuestions[1].year,
            text: siblingQuestions[1].text,
            options: sibOptions2,
            correctOption: siblingQuestions[1].correctOption,
            explanation: siblingQuestions[1].explanation,
            mnemonic: siblingQuestions[1].mnemonic,
            diagramSvg: siblingQuestions[1].diagramSvg,
            isVariant: true,
            variantIndex: 2,
          });
        } else {
          questionsForTopic.push(
            generateCalculationVariant(
              {
                id: baseQuestion.id,
                subject: baseQuestion.subject,
                topic: baseQuestion.topic,
                concept: baseQuestion.concept,
                text: baseQuestion.text,
                options: parsedOptions,
                correctOption: baseQuestion.correctOption,
                explanation: baseQuestion.explanation,
                mnemonic: baseQuestion.mnemonic,
                diagramSvg: baseQuestion.diagramSvg,
              },
              2
            )
          );
        }

        topicGroups.push({
          topic: group.topic,
          subject: group.subject,
          concept: group.concept,
          failedCount: group.failedCount,
          failedRecordIds: group.records.map((r) => r.id),
          questions: questionsForTopic.slice(0, 3), // Exactly 3 questions
          isMastered: false,
        });
      }

      return NextResponse.json({
        topicGroups,
        totalTopics: topicGroups.length,
        totalFailedQuestions: totalRecords,
      });
    }

    // ── 2. FLAT BATCH MODE (BACKWARD COMPATIBILITY) ──
    const reviewRecords = await prisma.failedQuestion.findMany({
      where: { userId },
      orderBy: { lastFailedAt: "desc" },
      skip,
      take: limit,
      include: {
        question: true,
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
      totalFailed: totalRecords,
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
  failedRecordIds: z.array(z.string()).optional(),
  isTopicCompleted: z.boolean().optional(),
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

    const { questionId, selectedOption, failedRecordIds, isTopicCompleted } = parsed.data;

    // Check if question exists directly in DB
    const question = await prisma.question.findUnique({
      where: { id: questionId.replace(/-v[12]$/, "") },
      select: {
        id: true,
        correctOption: true,
        explanation: true,
        mnemonic: true,
        concept: true,
        topic: true,
      },
    });

    let correctOption = question?.correctOption || "B";
    let explanation = question?.explanation || "Review governing principles for this topic.";
    let mnemonic = question?.mnemonic || null;

    // If an isomorphic variant was tested, handle known answers
    if (questionId.endsWith("-v1")) {
      correctOption = "B";
    } else if (questionId.endsWith("-v2")) {
      correctOption = "A";
    }

    const isCorrect = selectedOption === correctOption;

    if (isCorrect) {
      // Award XP for question answered
      try {
        const { awardUserXP } = await import("@/lib/gamification");
        await awardUserXP(userId, "QUESTION_ANSWERED", {
          concept: question?.concept || "Topic Revision",
          source: "revision_hub",
        });

        // If the entire 3-question topic drill is completed, clear all failed records for that topic
        if (isTopicCompleted && failedRecordIds && failedRecordIds.length > 0) {
          await prisma.failedQuestion.deleteMany({
            where: {
              id: { in: failedRecordIds },
              userId,
            },
          });

          // Award bonus XP for mastering topic
          await awardUserXP(userId, "TOPIC_COMPLETED", {
            topic: question?.topic,
            source: "topic_revision_mastery",
          });
        }
      } catch (xpErr) {
        console.warn("Could not award revision XP:", xpErr);
      }
    }

    return NextResponse.json({
      isCorrect,
      correctOption,
      explanation,
      mnemonic,
      topicMastered: isCorrect && Boolean(isTopicCompleted),
      message: isCorrect
        ? "Mastered! Excellent work locking down this concept."
        : "Not quite yet! Review the examiner solution below to solidify the principle.",
    });
  } catch (err) {
    console.error("[revision/POST] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
