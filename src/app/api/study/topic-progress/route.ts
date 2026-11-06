import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { awardUserXP } from "@/lib/gamification";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ progress: [], guest: true });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const stream = searchParams.get("stream");

    const whereClause: {
      userId: string;
      subject?: string;
      stream?: string;
    } = { userId };

    if (subject) {
      whereClause.subject = subject.toLowerCase().trim();
    }
    if (stream) {
      whereClause.stream = stream.toLowerCase().trim();
    }

    const records = await prisma.topicProgress.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ progress: records });
  } catch (error: unknown) {
    console.error("Error fetching topic progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic progress" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const {
      subject,
      stream,
      topicSlug,
      topicTitle,
      studentNote,
      aiFeedback,
      aiScore,
      quizScore,
      quizTotal,
      isCompleted,
    } = body;

    if (!subject || !topicSlug || !topicTitle) {
      return NextResponse.json(
        { error: "subject, topicSlug, and topicTitle are required" },
        { status: 400 }
      );
    }

    const normalizedSubject = subject.toLowerCase().trim();
    const normalizedStream = (stream || "science").toLowerCase().trim();

    // Guest response if not logged in
    if (!userId) {
      return NextResponse.json({
        guest: true,
        progress: {
          id: `guest-${topicSlug}`,
          userId: "guest",
          subject: normalizedSubject,
          stream: normalizedStream,
          topicSlug,
          topicTitle,
          studentNote: studentNote ?? null,
          aiFeedback: aiFeedback ?? null,
          aiScore: aiScore ?? null,
          quizScore: quizScore ?? null,
          quizTotal: quizTotal ?? null,
          isCompleted: Boolean(isCompleted),
          completedAt: isCompleted ? new Date().toISOString() : null,
        },
      });
    }

    // Check existing record
    const existing = await prisma.topicProgress.findUnique({
      where: {
        userId_subject_topicSlug: {
          userId,
          subject: normalizedSubject,
          topicSlug,
        },
      },
    });

    const markAsCompleted = Boolean(isCompleted);
    const completedAt = markAsCompleted
      ? existing?.completedAt ?? new Date()
      : null;

    const updated = await prisma.topicProgress.upsert({
      where: {
        userId_subject_topicSlug: {
          userId,
          subject: normalizedSubject,
          topicSlug,
        },
      },
      update: {
        topicTitle,
        stream: normalizedStream,
        ...(studentNote !== undefined ? { studentNote } : {}),
        ...(aiFeedback !== undefined ? { aiFeedback } : {}),
        ...(aiScore !== undefined ? { aiScore } : {}),
        ...(quizScore !== undefined ? { quizScore } : {}),
        ...(quizTotal !== undefined ? { quizTotal } : {}),
        ...(isCompleted !== undefined ? { isCompleted: markAsCompleted, completedAt } : {}),
      },
      create: {
        userId,
        subject: normalizedSubject,
        stream: normalizedStream,
        topicSlug,
        topicTitle,
        studentNote: studentNote ?? null,
        aiFeedback: aiFeedback ?? null,
        aiScore: aiScore ?? null,
        quizScore: quizScore ?? null,
        quizTotal: quizTotal ?? null,
        isCompleted: markAsCompleted,
        completedAt,
      },
    });

    // If newly completed, award +50 XP via gamification
    let xpAwardResult = null;
    if (markAsCompleted && !existing?.isCompleted) {
      try {
        xpAwardResult = await awardUserXP(userId, "TOPIC_COMPLETED", {
          subject: normalizedSubject,
          topicSlug,
          topicTitle,
        });
      } catch (xpErr) {
        console.warn("Could not award topic completion XP:", xpErr);
      }
    }

    return NextResponse.json({
      success: true,
      progress: updated,
      xpResult: xpAwardResult,
    });
  } catch (error: unknown) {
    console.error("Error updating topic progress:", error);
    return NextResponse.json(
      { error: "Failed to update topic progress" },
      { status: 500 }
    );
  }
}

