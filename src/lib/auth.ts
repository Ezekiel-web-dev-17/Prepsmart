import { auth as clerkAuth } from "@clerk/nextjs/server";

export const IS_CLERK_ENABLED =
  process.env.NEXT_PUBLIC_CLERK_ENABLED !== "false" &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder");

export const DEMO_USER_ID = "demo-user-1";

/**
 * Universal auth helper for server components, route handlers, and server actions.
 * Falls back to local offline demo user when Clerk is deactivated.
 */
export async function auth(): Promise<{ userId: string | null }> {
  if (!IS_CLERK_ENABLED) {
    return { userId: DEMO_USER_ID };
  }

  try {
    const session = await clerkAuth();
    return { userId: session.userId || DEMO_USER_ID };
  } catch (err) {
    // In offline or fallback mode, smoothly fallback to demo user
    return { userId: DEMO_USER_ID };
  }
}
