import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import MockExamClient from "./MockExamClient";

export const metadata: Metadata = {
  title: "JAMB Mock Exam Simulator | PrepSmart",
  description:
    "Official UTME Computer-Based Test simulation with authentic 120-minute timer, 10-column question grid, BODMAS calculator, and post-exam AI diagnostics.",
};

function MockExamSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-44 rounded-3xl bg-muted/60 border border-border" />
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/50 border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function MockExamContent() {
  await connection();
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.onboardingProfile.findUnique({
    where: { userId },
    select: { selectedSubjects: true },
  });

  let userSubjects: string[] = ["Use of English", "Mathematics", "Physics", "Chemistry"];
  if (profile?.selectedSubjects) {
    try {
      userSubjects = JSON.parse(profile.selectedSubjects);
    } catch {
      // Use defaults
    }
  }

  return <MockExamClient userSubjects={userSubjects} />;
}

export default function MockExamPage() {
  return (
    <Suspense fallback={<MockExamSkeleton />}>
      <MockExamContent />
    </Suspense>
  );
}
