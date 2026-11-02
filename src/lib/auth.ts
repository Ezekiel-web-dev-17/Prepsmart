import { auth as clerkAuth } from "@clerk/nextjs/server";

export const IS_CLERK_ENABLED =
  process.env.NEXT_PUBLIC_CLERK_ENABLED !== "false" &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder");

export const DEMO_USER_ID = "demo-user-1";

/**
 * Universal auth helper for server components, route handlers, and server actions.
 * Returns { userId: null } when no user is signed in.
 */
export async function auth(): Promise<{ userId: string | null }> {
  if (!IS_CLERK_ENABLED) {
    if (process.env.DEMO_USER_ENABLED === "true") {
      return { userId: DEMO_USER_ID };
    }
    return { userId: null };
  }

  try {
    const session = await clerkAuth();
    return { userId: session.userId || null };
  } catch (err) {
    return { userId: null };
  }
}
