"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { submitExamSession, type ExamSubmissionPayload } from "@/lib/exam";

/**
 * Server Action for submitting an exam session, clearing stale caches on
 * /revision, /progress, and /dashboard routes.
 */
export async function submitMockExamAction(payload: ExamSubmissionPayload) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required");
  }

  const result = await submitExamSession(userId, payload);

  // Bust Next.js cache so newly flagged review questions immediately appear
  revalidatePath("/revision");
  revalidatePath("/progress");
  revalidatePath("/dashboard");

  return result;
}
