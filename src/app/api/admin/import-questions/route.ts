import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ==========================================
// Zod Validation Schema for Imported Questions
// ==========================================
const QuestionOptionSchema = z.union([
  z.object({
    id: z.string().min(1),
    text: z.string().min(1),
  }),
  z.string().min(1),
]);

const QuestionImportItemSchema = z.object({
  subject: z.enum([
    "Use of English",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Literature",
    "Government",
    "Geography",
    "Commerce",
  ]),
  year: z.coerce.number().int().min(1978).max(2035),
  text: z.string().min(5, "Question text must be at least 5 characters"),
  options: z.union([
    z.array(QuestionOptionSchema).min(2).max(6),
    z.string().min(2), // Pre-serialized JSON string
  ]),
  correctOption: z.string().transform((val) => val.trim().toUpperCase()),
  topic: z.string().default("General"),
  concept: z.string().default("Core Syllabus Concept"),
  explanation: z.string().optional(),
  solution: z.string().optional(), // Alias for explanation
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

const PayloadSchema = z.union([
  z.object({
    questions: z.array(QuestionImportItemSchema).min(1).max(500),
  }),
  z.array(QuestionImportItemSchema).min(1).max(500),
]);

// ==========================================
// POST /api/admin/import-questions
// ==========================================
export async function POST(request: Request) {
  try {
    // 1. Authentication & Admin Authorization
    const { userId } = await auth();
    const adminKeyHeader = request.headers.get("x-admin-key");
    const configuredAdminKey = process.env.ADMIN_IMPORT_SECRET || process.env.CLERK_SECRET_KEY;

    const isApiKeyAuthorized =
      Boolean(configuredAdminKey) &&
      Boolean(adminKeyHeader) &&
      adminKeyHeader === configuredAdminKey;

    if (!userId && !isApiKeyAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication or valid x-admin-key header required." },
        { status: 401 }
      );
    }

    // 2. Parse & Validate Payload
    const rawBody = await request.json().catch(() => null);
    const parsed = PayloadSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload format",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const rawList = Array.isArray(parsed.data)
      ? parsed.data
      : parsed.data.questions;

    // 3. Normalize & In-Memory Deduplicate Input
    const normalizedMap = new Map<string, {
      subject: string;
      year: number;
      text: string;
      options: string;
      correctOption: string;
      topic: string;
      concept: string;
      explanation: string;
      difficulty: string;
      isActive: boolean;
    }>();

    for (const item of rawList) {
      // Normalize options to [{ id: "A", text: "..." }, ...]
      let formattedOptions: { id: string; text: string }[] = [];
      if (typeof item.options === "string") {
        try {
          formattedOptions = JSON.parse(item.options);
        } catch {
          formattedOptions = [
            { id: "A", text: item.options },
            { id: "B", text: "Option B" },
            { id: "C", text: "Option C" },
            { id: "D", text: "Option D" },
          ];
        }
      } else {
        formattedOptions = item.options.map((opt, idx) => {
          if (typeof opt === "string") {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            return { id: letter, text: opt };
          }
          return { id: opt.id.toUpperCase(), text: opt.text };
        });
      }

      // Ensure valid correctOption
      const validLetters = ["A", "B", "C", "D", "E"];
      const correctOpt = validLetters.includes(item.correctOption)
        ? item.correctOption
        : "A";

      const explanation = item.explanation || item.solution || "Detailed step-by-step solution provided in course syllabus.";

      // Unique deduplication key per question
      const dedupeKey = `${item.subject}::${item.year}::${item.text.trim().toLowerCase()}`;

      if (!normalizedMap.has(dedupeKey)) {
        normalizedMap.set(dedupeKey, {
          subject: item.subject,
          year: item.year,
          text: item.text.trim(),
          options: JSON.stringify(formattedOptions),
          correctOption: correctOpt,
          topic: item.topic || "General",
          concept: item.concept || "Core Syllabus Concept",
          explanation: explanation,
          difficulty: item.difficulty,
          isActive: true,
        });
      }
    }

    const uniqueCandidateQuestions = Array.from(normalizedMap.values());

    // 4. Check for Existing Duplicates in Database (by subject & year)
    const existingQuestions = await prisma.question.findMany({
      where: {
        OR: uniqueCandidateQuestions.map((q) => ({
          subject: q.subject,
          year: q.year,
        })),
      },
      select: {
        subject: true,
        year: true,
        text: true,
      },
    });

    const existingKeys = new Set(
      existingQuestions.map(
        (eq) => `${eq.subject}::${eq.year}::${eq.text.trim().toLowerCase()}`
      )
    );

    const questionsToInsert = uniqueCandidateQuestions.filter(
      (q) => !existingKeys.has(`${q.subject}::${q.year}::${q.text.trim().toLowerCase()}`)
    );

    // 5. Bulk Insert Non-Duplicates via createMany
    let insertedCount = 0;
    if (questionsToInsert.length > 0) {
      const result = await prisma.question.createMany({
        data: questionsToInsert,
      });
      insertedCount = result.count;
    }

    const skippedCount = rawList.length - insertedCount;

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${rawList.length} questions.`,
      inserted: insertedCount,
      skippedDuplicates: skippedCount,
      subjectsImpacted: [...new Set(questionsToInsert.map((q) => q.subject))],
    });
  } catch (error) {
    console.error("[api/admin/import-questions] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while importing questions." },
      { status: 500 }
    );
  }
}
