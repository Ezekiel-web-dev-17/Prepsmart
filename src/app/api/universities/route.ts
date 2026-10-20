import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUniversitiesQuerySchema } from "@/lib/validations/university";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {

    const validation = getUniversitiesQuerySchema.safeParse({
      search: searchParams.get("search") ?? undefined,
      type: searchParams.get("type") ?? undefined,
      course: searchParams.get("course") ?? undefined,
      maxCutOff: searchParams.get("maxCutOff") ?? undefined,
      minCutOff: searchParams.get("minCutOff") ?? undefined,
      postUtme: searchParams.get("postUtme") ?? undefined,
      zone: searchParams.get("zone") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      search,
      type,
      course,
      maxCutOff,
      minCutOff,
      postUtme,
      zone,
      sort,
    } = validation.data;

    const where: Prisma.UniversityWhereInput = {};

    if (type && type !== "all") {
      where.type = type;
    }

    if (zone && zone !== "All Zones" && zone !== "all") {
      where.zone = zone;
    }

    if (postUtme !== undefined) {
      where.postUtmeRequired = postUtme;
    }

    if (maxCutOff !== undefined || minCutOff !== undefined) {
      where.generalCutOff = {};
      if (maxCutOff !== undefined) {
        where.generalCutOff.lte = maxCutOff;
      }
      if (minCutOff !== undefined) {
        where.generalCutOff.gte = minCutOff;
      }
    }

    if (search && search.trim() !== "") {
      const trimmedSearch = search.trim();
      where.OR = [
        { name: { contains: trimmedSearch } },
        { acronym: { contains: trimmedSearch } },
        { city: { contains: trimmedSearch } },
        { state: { contains: trimmedSearch } },
      ];
    }

    if (course && course.trim() !== "" && course !== "all") {
      where.courses = {
        some: {
          courseName: { contains: course.trim() },
        },
      };
    }

    let orderBy: Prisma.UniversityOrderByWithRelationInput | Prisma.UniversityOrderByWithRelationInput[] = [
      { generalCutOff: "desc" },
      { name: "asc" },
    ];

    if (sort === "cutoff_asc") {
      orderBy = { generalCutOff: "asc" };
    } else if (sort === "cutoff_desc") {
      orderBy = { generalCutOff: "desc" };
    } else if (sort === "name_asc") {
      orderBy = { name: "asc" };
    } else if (sort === "name_desc") {
      orderBy = { name: "desc" };
    } else if (sort === "est_year") {
      orderBy = { estYear: "asc" };
    }

    const universities = await prisma.university.findMany({
      where,
      orderBy,
      include: {
        courses: {
          orderBy: { cutOffMark: "desc" },
        },
        documents: {
          orderBy: [{ isRequired: "desc" }, { category: "asc" }],
        },
      },
    });

    const enriched = universities.map((uni) => {
      const cutOffs = uni.courses.map((c) => c.cutOffMark);
      const minCourseCutOff = cutOffs.length > 0 ? Math.min(...cutOffs) : uni.generalCutOff;
      const maxCourseCutOff = cutOffs.length > 0 ? Math.max(...cutOffs) : uni.generalCutOff;

      return {
        ...uni,
        coursesCount: uni.courses.length,
        minCourseCutOff,
        maxCourseCutOff,
      };
    });

    return NextResponse.json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (error) {
    console.error("Failed to query universities:", error);
    return NextResponse.json(
      { error: "Failed to retrieve universities" },
      { status: 500 }
    );
  }
}
