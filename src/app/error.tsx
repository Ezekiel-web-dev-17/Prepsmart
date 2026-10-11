"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("App Segment Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs text-center space-y-6 transition-colors duration-200">
        {/* Warning Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Header Content */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Something went wrong!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We ran into an unexpected issue while loading this study section. Don&apos;t worry — your lesson progress is safe.
          </p>
        </div>

        {/* Error Digest (if available in production) */}
        {error.digest && (
          <div className="bg-muted px-3 py-1.5 rounded-lg inline-block text-[11px] font-mono text-muted-foreground border border-border">
            Error ID: <span className="text-foreground">{error.digest}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Try again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-xs transition-colors text-center"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
