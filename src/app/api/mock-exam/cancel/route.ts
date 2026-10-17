import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { cancelExamSession } from "@/lib/exam";
import { z } from "zod";

const CancelSchema = z.object({
  sessionToken: z.string().length(64),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = CancelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid session token" }, { status: 400 });
    }

    const success = await cancelExamSession(userId, parsed.data.sessionToken);

    return NextResponse.json({
      success,
      message: success ? "Exam cancelled" : "Session not found or already closed",
    });
  } catch (err) {
    console.error("[exam/cancel] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
