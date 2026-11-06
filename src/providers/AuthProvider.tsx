"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ClerkProvider,
  useUser as useClerkUser,
  UserButton as ClerkUserButton,
} from "@clerk/nextjs";

const IS_CLERK_ENABLED =
  process.env.NEXT_PUBLIC_CLERK_ENABLED !== "false" &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder");

interface AuthContextValue {
  isSignedIn: boolean;
  isLoaded: boolean;
  user: {
    id: string;
    fullName: string;
    firstName: string;
    primaryEmailAddress?: { emailAddress: string };
  } | null;
}

const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_USER_ENABLED === "true";

const defaultDemoUser = {
  id: "demo-user-1",
  fullName: "Demo Candidate",
  firstName: "Demo",
  primaryEmailAddress: { emailAddress: "demo@prepsmart.ng" },
};

const LocalAuthContext = createContext<AuthContextValue>({
  isSignedIn: IS_DEMO_MODE,
  isLoaded: true,
  user: IS_DEMO_MODE ? defaultDemoUser : null,
});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!IS_CLERK_ENABLED) {
    return (
      <LocalAuthContext.Provider
        value={{
          isSignedIn: IS_DEMO_MODE,
          isLoaded: true,
          user: IS_DEMO_MODE ? defaultDemoUser : null,
        }}
      >
        {children}
      </LocalAuthContext.Provider>
    );
  }

  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  );
}

/**
 * Universal hook for retrieving current user status across both online Clerk mode
 * and offline/local demo mode.
 */
export function useCurrentUser(): AuthContextValue {
  if (!IS_CLERK_ENABLED) {
    return useContext(LocalAuthContext);
  }
  return useClerkUserWrapper();
}

function useClerkUserWrapper(): AuthContextValue {
  const clerk = useClerkUser();
  return {
    isSignedIn: !!clerk.isSignedIn,
    isLoaded: clerk.isLoaded,
    user: clerk.user
      ? {
          id: clerk.user.id,
          fullName: clerk.user.fullName || "Candidate",
          firstName: clerk.user.firstName || "Candidate",
          primaryEmailAddress: clerk.user.primaryEmailAddress
            ? { emailAddress: clerk.user.primaryEmailAddress.emailAddress }
            : undefined,
        }
      : null,
  };
}

/**
 * Universal User Avatar/Profile button.
 */
export function AppUserButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />;
  }

  if (!IS_CLERK_ENABLED) {
    if (!IS_DEMO_MODE) {
      return null;
    }
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold"
        title="Offline Demo Candidate"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Demo Candidate</span>
      </div>
    );
  }

  return (
    <ClerkUserButton
      appearance={{
        elements: {
          avatarBox: "w-8 h-8 rounded-xl",
        },
      }}
    />
  );
}
