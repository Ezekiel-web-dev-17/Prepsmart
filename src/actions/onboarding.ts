"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { awardUserXP } from "@/lib/gamification";

const onboardingSchema = z.object({
  targetScore: z.number().int().min(100).max(400).default(280),
  targetExamDate: z.string().optional(),
  departmentStream: z.enum(["science", "commercial", "arts"]).default("science"),
  selectedSubjects: z.array(z.string()).min(1).max(6),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
  dailyStudyMinutes: z.number().int().min(15).max(300).default(45),
  preferredStudyTime: z.enum(["morning", "afternoon", "evening", "night"]).default("evening"),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export async function saveOnboardingProfile(formData: OnboardingFormData) {
  try {
    const { userId: clerkUserId } = await auth();
    const userId = clerkUserId || "demo-user-1";

    const parsed = onboardingSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid onboarding form data",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const data = parsed.data;

    // Ensure User exists
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@student.prepsmart.ng`,
        name: `Student ${userId.slice(-4)}`,
      },
    });

    // Upsert OnboardingProfile
    const profile = await prisma.onboardingProfile.upsert({
      where: { userId },
      update: {
        targetScore: data.targetScore,
        targetExamDate: data.targetExamDate ? new Date(data.targetExamDate) : null,
        departmentStream: data.departmentStream,
        selectedSubjects: JSON.stringify(data.selectedSubjects),
        proficiencyLevel: data.proficiencyLevel,
        dailyStudyMinutes: data.dailyStudyMinutes,
        preferredStudyTime: data.preferredStudyTime,
        completed: true,
      },
      create: {
        userId,
        targetScore: data.targetScore,
        targetExamDate: data.targetExamDate ? new Date(data.targetExamDate) : null,
        departmentStream: data.departmentStream,
        selectedSubjects: JSON.stringify(data.selectedSubjects),
        proficiencyLevel: data.proficiencyLevel,
        dailyStudyMinutes: data.dailyStudyMinutes,
        preferredStudyTime: data.preferredStudyTime,
        completed: true,
      },
    });

    // Award Onboarding bonus XP (+100 XP)
    let xpResult = null;
    try {
      xpResult = await awardUserXP(userId, "DIAGNOSTIC_COMPLETED", {
        stream: data.departmentStream,
        targetScore: data.targetScore,
      });
    } catch (e) {
      console.warn("Failed to award onboarding XP:", e);
    }

    return {
      success: true,
      profile,
      xpEarned: xpResult?.pointsAwarded ?? 100,
    };
  } catch (err) {
    console.error("Save onboarding profile error:", err);
    return {
      success: false,
      error: "Failed to persist onboarding profile. Please try again.",
    };
  }
}

export async function getCandidateOnboardingStatus(userId: string) {
  const profile = await prisma.onboardingProfile.findUnique({
    where: { userId },
  });
  return profile;
}
