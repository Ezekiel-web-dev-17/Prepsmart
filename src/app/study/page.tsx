import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudyHubView from "./StudyHubView";
import {
  normalizeStreamSlug,
  normalizeSubjectSlug,
  getSubjectCurriculum,
} from "./curriculum-data";

export const dynamic = "force-dynamic";

interface StudyPageProps {
  searchParams?: Promise<{
    tab?: string;
    stream?: string;
    department?: string;
    subject?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: StudyPageProps): Promise<Metadata> {
  const resolved = searchParams ? await searchParams : {};
  const hasSubject = !!resolved.subject;
  const streamSlug = normalizeStreamSlug(resolved.stream || resolved.department);
  const subjectSlug = normalizeSubjectSlug(resolved.subject);

  if (hasSubject) {
    const cur = getSubjectCurriculum(streamSlug, subjectSlug);
    return {
      title: `${cur.subjectName} Syllabus & All Topics — JAMB UTME 2026 | PrepSmart`,
      description: `Complete list of all ${cur.totalTopics} official ${cur.subjectName} topics according to the 2026 JAMB curriculum for ${cur.streamName}. Includes exam structure, objectives, contents, and examiner trap warnings.`,
      keywords: [
        `JAMB ${cur.subjectName} syllabus`,
        `${cur.subjectName} topics UTME`,
        `${cur.subjectName} curriculum 2026`,
        `JAMB ${cur.streamBadge}`,
        "JAMB active recall",
      ],
    };
  }

  return {
    title: "Study Hub, Subject Syllabuses & JAMB CBT Mock Exam | PrepSmart",
    description:
      "Master the 2026 JAMB UTME syllabus with our structured 2 to 3 month curriculum, official subject topic lists, examiner trap alerts, and authentic 120-minute Computer-Based Test (CBT) mock exam simulations.",
    keywords: [
      "JAMB mock exam",
      "UTME CBT simulator",
      "JAMB study curriculum",
      "JAMB 2026 syllabus",
      "UTME study curriculum",
      "examiner traps JAMB",
      "JAMB active recall",
    ],
  };
}

export default async function StudyPage({ searchParams }: StudyPageProps) {
  await connection();
  const { userId } = await auth();

  const resolvedParams = searchParams ? await searchParams : {};
  const streamParam = resolvedParams.stream || resolvedParams.department || null;
  const subjectParam = resolvedParams.subject || null;
  const hasSubjectParam = !!(streamParam || subjectParam);

  const initialStream = normalizeStreamSlug(streamParam);
  const initialSubject = normalizeSubjectSlug(subjectParam);

  let initialTab: "curriculum" | "mock-exam" | "subject-syllabus" = "curriculum";
  if (resolvedParams.tab === "mock-exam") {
    if (!userId) {
      redirect("/sign-in?redirect_url=/study?tab=mock-exam");
    }
    initialTab = "mock-exam";
  } else if (hasSubjectParam || userId) {
    initialTab = "subject-syllabus";
  }

  let userSubjects: string[] = ["Use of English", "Mathematics", "Physics", "Chemistry"];

  if (userId) {
    const profile = await prisma.onboardingProfile
      .findUnique({
        where: { userId },
        select: { selectedSubjects: true },
      })
      .catch(() => null);

    if (profile?.selectedSubjects) {
      try {
        userSubjects = JSON.parse(profile.selectedSubjects);
      } catch {
        // use default subjects
      }
    }
  }

  return (
    <StudyHubView
      userSubjects={userSubjects}
      initialTab={initialTab}
      initialStream={initialStream}
      initialSubject={initialSubject}
      hasSubjectParam={hasSubjectParam}
      isAuthenticated={!!userId}
    />
  );
}
