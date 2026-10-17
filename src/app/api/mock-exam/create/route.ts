import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createExamSession } from "@/lib/exam";
import { z } from "zod";

const CreateSessionSchema = z.object({
  subjectMode: z.string().optional(),
  selectedSubjects: z
    .array(z.string().min(1).max(50))
    .min(1, "Please select at least 1 subject")
    .max(4, "You can select a maximum of 4 subjects"),
});

export async function POST(request: Request) {
  try {
    // 1. Require authenticated user — no anonymous exam sessions
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 2. Parse and validate body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = CreateSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid exam configuration", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subjectMode, selectedSubjects } = parsed.data;

    // Resolve mode descriptor
    const resolvedMode =
      subjectMode ||
      (selectedSubjects.length === 4
        ? "four_subjects"
        : selectedSubjects.length === 1
        ? "single_subject"
        : `${selectedSubjects.length}_subjects`);

    // 3. Create server-side session (correctAnswers never leave server)
    const sessionData = await createExamSession(userId, resolvedMode, selectedSubjects);

    // Security header: no caching of exam sessions
    return NextResponse.json(sessionData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create exam session";
    // Security: don't expose internal errors
    if (message.includes("No questions available")) {
      return NextResponse.json({ error: message }, { status: 422 });
    }
    console.error("[exam/create] Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
