export default function ResultsLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 rounded-3xl bg-muted/60 border border-border" />

      {/* Subject Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/50 border border-border" />
        ))}
      </div>

      {/* Review List Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-60 bg-muted rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-3xl bg-muted/40 border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
