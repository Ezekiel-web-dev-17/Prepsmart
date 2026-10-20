"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type Department = "SCIENCE" | "ART" | "COMMERCIAL";

const profileUpdateSchema = z.object({
  department: z.enum(["SCIENCE", "ART", "COMMERCIAL"]),
  targetScore: z.number().int().min(100).max(400),
  targetExamDate: z.string().nullable().optional(),
  selectedSubjects: z.array(z.string()).min(1).max(6),
  proficiencyLevel: z.enum(["beginner", "intermediate", "advanced"]),
  dailyStudyMinutes: z.number().int().min(15).max(300),
  preferredStudyTime: z.enum(["morning", "afternoon", "evening", "night"]),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

/**
 * Server Action allowing candidates to update their academic department,
 * selected subjects, and UTME target settings from the /profile route.
 */
export async function updateProfileSettingsAction(data: ProfileUpdateInput) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Authentication required to update profile settings." };
    }

    const parsed = profileUpdateSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        error: "Invalid profile data",
        details: parsed.error.flatten().fieldErrors,
      };
    }

    const input = parsed.data;

    // Convert enum to departmentStream string for legacy compatibility
    const streamString =
      input.department === "COMMERCIAL"
        ? "commercial"
        : input.department === "ART"
        ? "arts"
        : "science";

    const updatedProfile = await prisma.onboardingProfile.upsert({
      where: { userId },
      update: {
        departmentStream: streamString,
        targetScore: input.targetScore,
        targetExamDate: input.targetExamDate ? new Date(input.targetExamDate) : null,
        selectedSubjects: JSON.stringify(input.selectedSubjects),
        proficiencyLevel: input.proficiencyLevel,
        dailyStudyMinutes: input.dailyStudyMinutes,
        preferredStudyTime: input.preferredStudyTime,
        completed: true,
      },
      create: {
        userId,
        departmentStream: streamString,
        targetScore: input.targetScore,
        targetExamDate: input.targetExamDate ? new Date(input.targetExamDate) : null,
        selectedSubjects: JSON.stringify(input.selectedSubjects),
        proficiencyLevel: input.proficiencyLevel,
        dailyStudyMinutes: input.dailyStudyMinutes,
        preferredStudyTime: input.preferredStudyTime,
        completed: true,
      },
    });

    // Revalidate all pages dependent on candidate profile and department
    revalidatePath("/profile");
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/study");

    return {
      success: true,
      profile: {
        department: input.department,
        targetScore: updatedProfile.targetScore,
        selectedSubjects: JSON.parse(updatedProfile.selectedSubjects),
      },
    };
  } catch (err) {
    console.error("[updateProfileSettingsAction] Error:", err);
    return {
      success: false,
      error: "Failed to update profile settings. Please try again.",
    };
  }
}
