export default function RevisionLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-64 bg-muted rounded-xl" />
        <div className="h-4 w-96 bg-muted/60 rounded-md" />
      </div>

      {/* Metrics & Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-card border border-border p-4 space-y-2">
            <div className="h-4 w-20 bg-muted/60 rounded" />
            <div className="h-8 w-16 bg-muted rounded-lg" />
          </div>
        ))}
      </div>

      {/* Questions list skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-card border border-border p-6 space-y-3">
            <div className="h-5 w-3/4 bg-muted/70 rounded-md" />
            <div className="h-4 w-1/2 bg-muted/50 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
