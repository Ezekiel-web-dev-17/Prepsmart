export default function MockExamLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-44 rounded-3xl bg-muted/60 border border-border" />

      {/* Subject Selection Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/50 border border-border" />
          ))}
        </div>
      </div>

      {/* Start Button Skeleton */}
      <div className="h-14 rounded-2xl bg-muted/60 border border-border" />
    </div>
  );
}
