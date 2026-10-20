import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CounsellorDashboard from "./CounsellorDashboard";
import type { UniversityData } from "./types";

export const metadata: Metadata = {
  title: "Nigerian University Admission Counsellor & Cut-Off Finder",
  description:
    "Explore 26+ accredited Nigerian universities, match your target JAMB score against 2026/2027 departmental cut-offs, inspect Post-UTME screening policies, and manage your required admission documents.",
  keywords: [
    "JAMB Cut-Off Marks",
    "Post-UTME Screening",
    "Nigerian Universities",
    "UNILAG Cut-Off",
    "University of Ibadan Cut-Off",
    "Direct Entry Requirements",
    "JAMB Admission Counsellor",
    "O'Level Screening",
  ],
};

export const instant = false;

export default async function UniversitiesPage() {
  const rawUniversities = await prisma.university.findMany({
    orderBy: [{ generalCutOff: "desc" }, { name: "asc" }],
    include: {
      courses: {
        orderBy: { cutOffMark: "desc" },
      },
      documents: {
        orderBy: [{ isRequired: "desc" }, { category: "asc" }],
      },
    },
  });

  // Serialize to plain JSON objects for client component
  const universities: UniversityData[] = rawUniversities.map((uni) => ({
    ...uni,
    createdAt: uni.createdAt.toISOString(),
    updatedAt: uni.updatedAt.toISOString(),
    coursesCount: uni.courses.length,
    minCourseCutOff:
      uni.courses.length > 0
        ? Math.min(...uni.courses.map((c) => c.cutOffMark))
        : uni.generalCutOff,
    maxCourseCutOff:
      uni.courses.length > 0
        ? Math.max(...uni.courses.map((c) => c.cutOffMark))
        : uni.generalCutOff,
  }));

  return <CounsellorDashboard initialUniversities={universities} />;
}
