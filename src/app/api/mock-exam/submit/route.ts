import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { submitExamSession } from "@/lib/exam";
import { z } from "zod";

const SubmitSchema = z.object({
  sessionToken: z.string().length(64), // 32 bytes hex = 64 chars
  answers: z
    .record(
      z.string().min(1).max(64),            // questionId must be a valid non-empty string identifier
      z.enum(["A", "B", "C", "D"])          // option must be one of the four
    )
    .refine((obj) => Object.keys(obj).length <= 200, "Too many answers"),
  guessedQuestions: z.array(z.string().min(1).max(64)).max(200),
  timeSpentSeconds: z.number().int().min(0).max(7300), // max slightly above 2hrs
});

export async function POST(request: Request) {
  try {
    // 1. Require authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 2. Validate body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = SubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // 3. Submit — server verifies token ownership, timer, and scores everything
    const result = await submitExamSession(userId, parsed.data);

    return NextResponse.json(
      { attemptId: result.attemptId },
      {
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed";

    if (
      message.includes("Invalid or expired") ||
      message.includes("already been submitted") ||
      message.includes("expired")
    ) {
      return NextResponse.json({ error: message }, { status: 409 });
    }

    console.error("[exam/submit] Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
