import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getExamResult } from "@/lib/exam";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { attemptId } = await params;
    if (!attemptId || !/^[a-zA-Z0-9_-]{10,64}$/.test(attemptId)) {
      return NextResponse.json({ error: "Invalid attempt ID" }, { status: 400 });
    }

    // Server validates userId ownership before returning correct answers
    const result = await getExamResult(userId, attemptId);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Not found";
    if (message.includes("not found") || message.includes("access denied")) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
    console.error("[exam/result] Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
