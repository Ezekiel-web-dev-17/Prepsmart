import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UniversityDetailView from "./UniversityDetailView";
import type { UniversityData } from "../types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const university = await prisma.university.findFirst({
    where: { OR: [{ slug: id }, { id }] },
  });

  if (!university) {
    return {
      title: "University Not Found | PREPSMART",
    };
  }

  const acronymSuffix = university.acronym ? ` (${university.acronym})` : "";
  return {
    title: `${university.name}${acronymSuffix} Cut-Offs & Screening Requirements`,
    description: `Explore 2026/2027 departmental cut-off marks, Post-UTME screening protocols, O'Level requirements, and admission document checklist for ${university.name}.`,
    openGraph: {
      title: `${university.name} Admission Counsellor Hub`,
      description: `Official cut-off marks, degree programmes, and screening guide for ${university.name}.`,
    },
  };
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { id } = await params;

  const rawUniversity = await prisma.university.findFirst({
    where: {
      OR: [{ slug: id }, { id: id }],
    },
    include: {
      courses: {
        orderBy: { cutOffMark: "desc" },
      },
      documents: {
        orderBy: [{ isRequired: "desc" }, { category: "asc" }],
      },
    },
  });

  if (!rawUniversity) {
    notFound();
  }

  const university: UniversityData = {
    ...rawUniversity,
    createdAt: rawUniversity.createdAt.toISOString(),
    updatedAt: rawUniversity.updatedAt.toISOString(),
    coursesCount: rawUniversity.courses.length,
    minCourseCutOff:
      rawUniversity.courses.length > 0
        ? Math.min(...rawUniversity.courses.map((c) => c.cutOffMark))
        : rawUniversity.generalCutOff,
    maxCourseCutOff:
      rawUniversity.courses.length > 0
        ? Math.max(...rawUniversity.courses.map((c) => c.cutOffMark))
        : rawUniversity.generalCutOff,
  };

  return <UniversityDetailView university={university} />;
}
