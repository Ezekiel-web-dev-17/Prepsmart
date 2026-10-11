import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getUsersQuerySchema,
  createUserSchema,
  type User,
} from "@/lib/validations/user";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const queryValidation = getUsersQuerySchema.safeParse({
    limit: searchParams.get("limit") ?? undefined,
    page: searchParams.get("page") ?? undefined,
  });

  if (!queryValidation.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: queryValidation.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { limit, page } = queryValidation.data;
  const skip = (page - 1) * limit;

  try {
    const users: User[] = await prisma.user.findMany({
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users, page, limit });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validation = createUserSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    const { name, email } = validation.data;

    const newUser: User = await prisma.user.create({
      data: {
        name: name ?? null,
        email,
      },
    });

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
