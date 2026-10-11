"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createUserSchema, type User } from "@/lib/validations/user";
import { checkServerActionRateLimit } from "@/lib/ratelimit";

export type CreateUserResult =
  | { success: true; user: User }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createUser(formData: FormData): Promise<CreateUserResult> {
  // Defense-in-depth: Enforce rate limiting on Server Action
  const rateLimitCheck = await checkServerActionRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      error: rateLimitCheck.error,
    };
  }

  const validation = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validation.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validation.data;

  try {
    const newUser: User = await prisma.user.create({
      data: { name: name ?? null, email },
    });

    // Revalidate the /users path so UI refreshes
    revalidatePath("/users");

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Database operation failed" };
  }
}
