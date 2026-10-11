export default function UniversityDetailLoading() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 bg-muted rounded w-48" />

      {/* Hero Card Skeleton */}
      <div className="h-64 rounded-3xl bg-muted/60 border border-border p-8 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="h-8 bg-muted rounded w-64" />
            <div className="h-4 bg-muted rounded w-48" />
          </div>
        </div>
        <div className="h-14 rounded-2xl bg-muted/50 mt-4" />
      </div>

      {/* Tabs Skeleton */}
      <div className="h-10 border-b border-border flex gap-4">
        <div className="h-8 bg-muted rounded w-32" />
        <div className="h-8 bg-muted rounded w-44" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-muted/40 border border-border/60 p-5 space-y-3"
          >
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-12 bg-muted rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
