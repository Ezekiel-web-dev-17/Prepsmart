import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUniversityImageMeta } from "@/data/university-images";
import { getUniversityLogoMeta } from "@/data/university-logos";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Invalid university identifier" },
        { status: 400 }
      );
    }

    const university = await prisma.university.findFirst({
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

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    const imgMeta = getUniversityImageMeta(university.slug, university.acronym);
    const logoMeta = getUniversityLogoMeta(university.slug, university.acronym);
    const imageUrl = university.imageUrl || imgMeta.imageUrl;
    const logoUrl = university.logoUrl || logoMeta.logoUrl;
    const imageLandmark = university.imageLandmark || imgMeta.landmark;
    const imageCaption = university.imageCaption || imgMeta.caption;
    const brandColor = university.brandColor || logoMeta.brandColor;
    const secondaryColor = university.secondaryColor || logoMeta.secondaryColor;

    if (!university.imageUrl || !university.logoUrl) {
      prisma.university
        .update({
          where: { id: university.id },
          data: {
            imageUrl,
            logoUrl,
            imageLandmark,
            imageCaption,
            brandColor,
            secondaryColor,
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      data: {
        ...university,
        imageUrl,
        logoUrl,
        imageLandmark,
        imageCaption,
        brandColor,
        secondaryColor,
      },
    });
  } catch (error) {
    console.error("Failed to fetch university details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve university details" },
      { status: 500 }
    );
  }
}
