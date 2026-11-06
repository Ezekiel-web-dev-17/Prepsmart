import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ZapIcon, ArrowRightIcon } from "@/components/ui/icons";

const IS_CLERK_ENABLED =
  process.env.NEXT_PUBLIC_CLERK_ENABLED !== "false" &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("placeholder");

export default function SignInPage() {
  if (!IS_CLERK_ENABLED) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-5 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold">
            <ZapIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">
              Offline Demo Candidate
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clerk authentication is currently deactivated for fast offline builds.
              You are signed in as <strong>Demo Candidate</strong>.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs items-center justify-center gap-1.5 transition-all"
          >
            <span>Open Dashboard</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <SignIn fallbackRedirectUrl="/dashboard" />
    </div>
  );
}
