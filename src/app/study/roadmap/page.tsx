import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "UTME Interactive Visual Roadmap | PrepSmart",
  description:
    "Master the JAMB syllabus step-by-step with our interactive Roadmap.sh-style visual learning pathways, Nigerian textbook advice, Feynman AI evaluation, and CBT drills.",
};

interface RoadmapPageProps {
  searchParams: Promise<{
    stream?: string;
    subject?: string;
    department?: string;
  }>;
}

export default async function RoadmapPage({ searchParams }: RoadmapPageProps) {
  const resolvedParams = await searchParams;
  const { userId } = await auth();

  let userDepartment: "science" | "commercial" | "arts" = "science";
  let initialSubject = "mathematics";

  if (userId) {
    try {
      const profile = await prisma.onboardingProfile.findUnique({
        where: { userId },
        select: { departmentStream: true, selectedSubjects: true },
      });

      if (profile?.departmentStream) {
        const dept = profile.departmentStream.toLowerCase();
        if (dept.includes("com")) userDepartment = "commercial";
        else if (dept.includes("art")) userDepartment = "arts";
        else userDepartment = "science";
      }

      if (profile?.selectedSubjects) {
        try {
          const subjects = JSON.parse(profile.selectedSubjects);
          if (Array.isArray(subjects) && subjects.length > 0) {
            initialSubject = subjects[0].toLowerCase();
          }
        } catch {
          // Keep default
        }
      }
    } catch (err) {
      console.warn("Could not load user profile for roadmap:", err);
    }
  }

  // Override with query params if specified
  const effectiveStream =
    (resolvedParams.stream || resolvedParams.department || userDepartment) as
      | "science"
      | "commercial"
      | "arts";
  const effectiveSubject = resolvedParams.subject || initialSubject;

  // Seamlessly redirect to the unified syllabus roadmap tab
  redirect(`/study?tab=subject-syllabus&stream=${effectiveStream}&subject=${effectiveSubject}`);
}
