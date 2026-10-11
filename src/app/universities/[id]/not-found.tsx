import Link from "next/link";

export default function UniversityNotFound() {
  return (
    <div className="py-20 text-center space-y-5 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-foreground">
          University Not Found
        </h2>
        <p className="text-sm text-muted-foreground">
          We could not find the Nigerian tertiary institution you requested. It
          may have been updated or the link may be incorrect.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/universities"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
        >
          Browse All Universities
        </Link>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-all border border-border"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
