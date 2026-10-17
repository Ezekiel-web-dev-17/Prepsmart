"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function StudyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Study Segment Error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6 transition-colors duration-200">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
          ⚠️
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Let&apos;s Get You Back on Track!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We couldn&apos;t load the requested study segment right now. Tap retry to continue your preparation.
          </p>
        </div>

        {error.digest && (
          <div className="bg-muted px-3 py-1.5 rounded-lg inline-block text-[11px] font-mono text-muted-foreground border border-border">
            Digest: <span className="text-foreground">{error.digest}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Try again
          </button>

          <Link
            href="/study"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors text-center"
          >
            Back to Curriculum
          </Link>
        </div>
      </div>
    </div>
  );
}
