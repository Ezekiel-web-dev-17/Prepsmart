import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({
      success: true,
      data: university,
    });
  } catch (error) {
    console.error("Failed to fetch university details:", error);
    return NextResponse.json(
      { error: "Failed to retrieve university details" },
      { status: 500 }
    );
  }
}
