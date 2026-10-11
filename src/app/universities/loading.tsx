export default function UniversitiesLoading() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 sm:h-72 rounded-3xl bg-muted/60 border border-border" />

      {/* Filter Bar Skeleton */}
      <div className="h-28 rounded-2xl bg-muted/50 border border-border" />

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-2xl bg-muted/40 border border-border/60 p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-32" />
              </div>
            </div>
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-12 bg-muted rounded w-full" />
            <div className="h-8 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
