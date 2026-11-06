import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CounsellorDashboard from "./CounsellorDashboard";
import type { UniversityData } from "./types";
import { UNIVERSITIES_DATA } from "@/data/universities";
import { getUniversityImageMeta } from "@/data/university-images";
import { getUniversityLogoMeta } from "@/data/university-logos";

export const metadata: Metadata = {
  title: "Nigerian University Admission Counsellor & Cut-Off Finder",
  description:
    "Explore 40+ accredited Nigerian federal, state, and private universities, inspect 2026/2027 departmental cut-offs, Post-UTME screening policies, and admission requirements.",
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

export const dynamic = "force-dynamic";

export default async function UniversitiesPage() {
  let rawUniversities: any[] = [];
  try {
    rawUniversities = await prisma.university.findMany({
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
  } catch (err) {
    console.warn("Prisma university fetch note, using fallback catalog:", err);
  }

  // 1. Serialize DB records
  const dbUniversities: UniversityData[] = rawUniversities.map((uni) => ({
    ...uni,
    createdAt: uni.createdAt.toISOString(),
    updatedAt: uni.updatedAt.toISOString(),
    // DB image fields (may be null for older rows)
    imageUrl: uni.imageUrl ?? null,
    logoUrl: uni.logoUrl ?? null,
    imageLandmark: uni.imageLandmark ?? null,
    imageCaption: uni.imageCaption ?? null,
    brandColor: uni.brandColor ?? null,
    secondaryColor: uni.secondaryColor ?? null,
    coursesCount: uni.courses.length,
    minCourseCutOff:
      uni.courses.length > 0
        ? Math.min(...uni.courses.map((c: any) => c.cutOffMark))
        : uni.generalCutOff,
    maxCourseCutOff:
      uni.courses.length > 0
        ? Math.max(...uni.courses.map((c: any) => c.cutOffMark))
        : uni.generalCutOff,
  }));

  // 2. Identify universities from catalog not yet in the DB
  const dbSlugs = new Set(rawUniversities.map((u) => u.slug.toLowerCase()));
  const additionalUniversities: UniversityData[] = UNIVERSITIES_DATA.filter(
    (uni) => !dbSlugs.has(uni.id.toLowerCase())
  ).map((uni) => {
    const courseValues = Object.values(uni.departmentalCutOffs || {});
    return {
      id: uni.id,
      slug: uni.id,
      name: uni.name,
      acronym: uni.acronym || null,
      type: uni.type,
      state: uni.state,
      city: uni.city,
      zone: uni.zone,
      generalCutOff: uni.generalCutOff,
      postUtmeRequired:
        uni.screeningType.toLowerCase().includes("post-utme") ||
        uni.screeningType.toLowerCase().includes("cbt") ||
        uni.screeningType.toLowerCase().includes("exam"),
      screeningType: uni.screeningType,
      annualTuitionEst: uni.annualTuitionEst,
      estYear: uni.estYear,
      website: uni.website,
      campusHighlights: uni.campusHighlights,
      imageUrl: null,
      logoUrl: null,
      imageLandmark: null,
      imageCaption: null,
      brandColor: null,
      secondaryColor: null,
      courses: Object.entries(uni.departmentalCutOffs || {}).map(([key, cutOff]) => ({
        id: `${uni.id}-${key}`,
        universityId: uni.id,
        courseName:
          key === "medicine"
            ? "Medicine & Surgery"
            : key === "computerScience"
            ? "Computer Science"
            : key === "massCommunication"
            ? "Mass Communication"
            : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        faculty: null,
        cutOffMark: cutOff,
        durationYears: key === "medicine" ? 6 : key === "engineering" || key === "pharmacy" ? 5 : 4,
        oLevelRequirements: "5 SSCE credits in English, Math, and relevant subjects",
        directEntryAccepted: true,
        directEntryRequirements: "JUPEB / ND Upper Credit in related discipline",
      })),
      documents: [
        {
          id: `${uni.id}-doc-1`,
          universityId: uni.id,
          title: "Original JAMB Result Slip",
          category: "JAMB",
          isRequired: true,
          description: "Official colored JAMB result slip with candidate photograph.",
        },
        {
          id: `${uni.id}-doc-2`,
          universityId: uni.id,
          title: "WAEC / NECO / NABTEB Certificate or Statement of Result",
          category: "O'Level",
          isRequired: true,
          description: "Original certificate or verified online statement of result in max 2 sittings.",
        },
        {
          id: `${uni.id}-doc-3`,
          universityId: uni.id,
          title: "Birth Certificate or Statutory Age Declaration",
          category: "Identity",
          isRequired: true,
          description: "Official National Population Commission (NPC) certificate or court declaration.",
        },
        {
          id: `${uni.id}-doc-4`,
          universityId: uni.id,
          title: "Local Government Area (LGA) Identification Certificate",
          category: "Identity",
          isRequired: true,
          description: "Official certificate verifying candidate's state and LGA of origin.",
        },
      ],
      coursesCount: courseValues.length,
      minCourseCutOff: courseValues.length > 0 ? Math.min(...courseValues) : uni.generalCutOff,
      maxCourseCutOff: courseValues.length > 0 ? Math.max(...courseValues) : uni.generalCutOff,
    };
  });

  const allUniversities = [...dbUniversities, ...additionalUniversities].sort(
    (a, b) => b.generalCutOff - a.generalCutOff || a.name.localeCompare(b.name)
  );

  return <CounsellorDashboard initialUniversities={allUniversities} />;
}
