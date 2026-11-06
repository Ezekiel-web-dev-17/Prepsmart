import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const profileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  targetScore: z.number().int().min(100).max(400).optional(),
  targetExamDate: z.string().nullable().optional(),
  departmentStream: z.enum(["science", "commercial", "arts"]).optional(),
  selectedSubjects: z.array(z.string()).min(1).max(6).optional(),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  dailyStudyMinutes: z.number().int().min(15).max(300).optional(),
  preferredStudyTime: z.enum(["morning", "afternoon", "evening", "night"]).optional(),
});

const DEFAULT_SUBJECTS: Record<string, string[]> = {
  science: ["Use of English", "Mathematics", "Physics", "Chemistry"],
  commercial: ["Use of English", "Mathematics", "Economics", "Accounting"],
  arts: ["Use of English", "Literature", "Government", "Christian Religious Studies"],
};

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, user: null, message: "Unauthenticated" },
        { status: 401 }
      );
    }

    // Fetch user and their onboarding profile
    let dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        onboardingProfile: true,
      },
    });

    // Auto-provision demo candidate or initial user if not in DB
    if (!dbUser) {
      dbUser = await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: `${userId}@student.prepsmart.ng`,
          name: "Candidate",
          xp: 100,
          onboardingProfile: {
            create: {
              targetScore: 280,
              departmentStream: "science",
              selectedSubjects: JSON.stringify(DEFAULT_SUBJECTS.science),
              proficiencyLevel: "intermediate",
              dailyStudyMinutes: 45,
              preferredStudyTime: "evening",
              completed: false,
            },
          },
        },
        include: {
          onboardingProfile: true,
        },
      });
    }

    const profile = dbUser.onboardingProfile;
    const stream = (profile?.departmentStream as "science" | "commercial" | "arts") || "science";

    let selectedSubjects: string[] = DEFAULT_SUBJECTS[stream];
    if (profile?.selectedSubjects) {
      try {
        const parsed = JSON.parse(profile.selectedSubjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          selectedSubjects = parsed;
        }
      } catch {
        // Fallback to default subjects for stream
      }
    }

    const userProfile = {
      id: dbUser.id,
      name: dbUser.name || "Candidate",
      email: dbUser.email,
      image: dbUser.image || null,
      xp: dbUser.xp,
      department: stream,
      departmentStream: stream,
      selectedSubjects,
      targetScore: profile?.targetScore || 280,
      targetExamDate: profile?.targetExamDate ? profile.targetExamDate.toISOString() : null,
      proficiencyLevel: (profile?.proficiencyLevel as "beginner" | "intermediate" | "advanced") || "intermediate",
      dailyStudyMinutes: profile?.dailyStudyMinutes || 45,
      preferredStudyTime: (profile?.preferredStudyTime as "morning" | "afternoon" | "evening" | "night") || "evening",
      hasCompletedOnboarding: !!profile?.completed,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve candidate profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = profileUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid profile data", details: validation.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = validation.data;

    // Update User record if name provided
    if (data.name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: data.name },
      });
    }

    // Update OnboardingProfile
    const profileUpdates: Record<string, unknown> = {};
    if (data.targetScore !== undefined) profileUpdates.targetScore = data.targetScore;
    if (data.targetExamDate !== undefined) {
      profileUpdates.targetExamDate = data.targetExamDate ? new Date(data.targetExamDate) : null;
    }
    if (data.departmentStream !== undefined) profileUpdates.departmentStream = data.departmentStream;
    if (data.selectedSubjects !== undefined) {
      profileUpdates.selectedSubjects = JSON.stringify(data.selectedSubjects);
    }
    if (data.proficiencyLevel !== undefined) profileUpdates.proficiencyLevel = data.proficiencyLevel;
    if (data.dailyStudyMinutes !== undefined) profileUpdates.dailyStudyMinutes = data.dailyStudyMinutes;
    if (data.preferredStudyTime !== undefined) profileUpdates.preferredStudyTime = data.preferredStudyTime;

    const updatedProfile = await prisma.onboardingProfile.upsert({
      where: { userId },
      update: profileUpdates,
      create: {
        userId,
        targetScore: data.targetScore ?? 280,
        departmentStream: data.departmentStream ?? "science",
        selectedSubjects: JSON.stringify(data.selectedSubjects ?? DEFAULT_SUBJECTS.science),
        proficiencyLevel: data.proficiencyLevel ?? "intermediate",
        dailyStudyMinutes: data.dailyStudyMinutes ?? 45,
        preferredStudyTime: data.preferredStudyTime ?? "evening",
        completed: true,
      },
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
