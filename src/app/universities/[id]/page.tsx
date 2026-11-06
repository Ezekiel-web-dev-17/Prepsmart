import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UniversityDetailView from "./UniversityDetailView";
import type { UniversityData } from "../types";
import { UNIVERSITIES_DATA } from "@/data/universities";
import { getUniversityImageMeta } from "@/data/university-images";
import { getUniversityLogoMeta } from "@/data/university-logos";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  let university = await prisma.university.findFirst({
    where: { OR: [{ slug: id }, { id }] },
  }).catch(() => null);

  if (!university) {
    const catalogUni = UNIVERSITIES_DATA.find(
      (u) => u.id === id || u.acronym?.toLowerCase() === id.toLowerCase()
    );
    if (catalogUni) {
      university = {
        name: catalogUni.name,
        acronym: catalogUni.acronym,
      } as any;
    }
  }

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

  let rawUniversity = await prisma.university.findFirst({
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
  }).catch(() => null);

  let university: UniversityData;

  if (rawUniversity) {
    university = {
      ...rawUniversity,
      createdAt: rawUniversity.createdAt.toISOString(),
      updatedAt: rawUniversity.updatedAt.toISOString(),
      imageUrl: rawUniversity.imageUrl ?? null,
      logoUrl: rawUniversity.logoUrl ?? null,
      imageLandmark: rawUniversity.imageLandmark ?? null,
      imageCaption: rawUniversity.imageCaption ?? null,
      brandColor: rawUniversity.brandColor ?? null,
      secondaryColor: rawUniversity.secondaryColor ?? null,
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
  } else {
    // Check fallback catalog
    const catalogUni = UNIVERSITIES_DATA.find(
      (u) => u.id === id || u.acronym?.toLowerCase() === id.toLowerCase()
    );
    if (!catalogUni) {
      notFound();
    }

    const courseValues = Object.values(catalogUni.departmentalCutOffs || {});
    const imgMeta = getUniversityImageMeta(catalogUni.id, catalogUni.acronym);
    const logoMeta = getUniversityLogoMeta(catalogUni.id, catalogUni.acronym);

    university = {
      id: catalogUni.id,
      slug: catalogUni.id,
      name: catalogUni.name,
      acronym: catalogUni.acronym || null,
      type: catalogUni.type,
      state: catalogUni.state,
      city: catalogUni.city,
      zone: catalogUni.zone,
      generalCutOff: catalogUni.generalCutOff,
      postUtmeRequired:
        catalogUni.screeningType.toLowerCase().includes("post-utme") ||
        catalogUni.screeningType.toLowerCase().includes("cbt") ||
        catalogUni.screeningType.toLowerCase().includes("exam"),
      screeningType: catalogUni.screeningType,
      annualTuitionEst: catalogUni.annualTuitionEst,
      estYear: catalogUni.estYear,
      website: catalogUni.website,
      campusHighlights: catalogUni.campusHighlights,
      imageUrl: imgMeta.imageUrl ?? null,
      logoUrl: logoMeta.logoUrl ?? null,
      imageLandmark: imgMeta.landmark ?? null,
      imageCaption: imgMeta.caption ?? null,
      brandColor: logoMeta.brandColor ?? null,
      secondaryColor: logoMeta.secondaryColor ?? null,
      courses: Object.entries(catalogUni.departmentalCutOffs || {}).map(([key, cutOff]) => ({
        id: `${catalogUni.id}-${key}`,
        universityId: catalogUni.id,
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
          id: `${catalogUni.id}-doc-1`,
          universityId: catalogUni.id,
          title: "Original JAMB Result Slip",
          category: "JAMB",
          isRequired: true,
          description: "Official colored JAMB result slip with candidate photograph.",
        },
        {
          id: `${catalogUni.id}-doc-2`,
          universityId: catalogUni.id,
          title: "WAEC / NECO / NABTEB Certificate or Statement of Result",
          category: "O'Level",
          isRequired: true,
          description: "Original certificate or verified online statement of result in max 2 sittings.",
        },
        {
          id: `${catalogUni.id}-doc-3`,
          universityId: catalogUni.id,
          title: "Birth Certificate or Statutory Age Declaration",
          category: "Identity",
          isRequired: true,
          description: "Official National Population Commission (NPC) certificate or court declaration.",
        },
        {
          id: `${catalogUni.id}-doc-4`,
          universityId: catalogUni.id,
          title: "Local Government Area (LGA) Identification Certificate",
          category: "Identity",
          isRequired: true,
          description: "Official certificate verifying candidate's state and LGA of origin.",
        },
      ],
      coursesCount: courseValues.length,
      minCourseCutOff: courseValues.length > 0 ? Math.min(...courseValues) : catalogUni.generalCutOff,
      maxCourseCutOff: courseValues.length > 0 ? Math.max(...courseValues) : catalogUni.generalCutOff,
    };
  }

  return <UniversityDetailView university={university} />;
}
