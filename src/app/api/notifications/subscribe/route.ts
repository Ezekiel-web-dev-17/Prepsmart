import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await request.json();

    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: "Invalid PushSubscription payload" },
        { status: 400 }
      );
    }

    // Identify user: from Clerk or placeholder demo user
    const targetUserId = clerkUserId || "demo-user-1";

    // Ensure user exists in Prisma
    await prisma.user.upsert({
      where: { id: targetUserId },
      update: {},
      create: {
        id: targetUserId,
        email: `${targetUserId}@student.prepsmart.ng`,
        name: `Student ${targetUserId.slice(-4)}`,
      },
    });

    const userAgent = request.headers.get("user-agent") || "Browser Device";

    // Upsert subscription
    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent,
        isActive: true,
        userId: targetUserId,
      },
      create: {
        userId: targetUserId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Push notification subscription registered",
      data: { id: subscription.id },
    });
  } catch (error) {
    console.error("Failed to register push subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
