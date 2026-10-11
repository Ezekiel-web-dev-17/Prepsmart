export default function LeaderboardLoading() {
  return (
    <div className="space-y-10 pb-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 rounded-3xl bg-muted/60 border border-border" />

      {/* Podium skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        <div className="h-44 rounded-2xl bg-muted/50 border border-border" />
        <div className="h-56 rounded-3xl bg-muted/70 border border-border" />
        <div className="h-44 rounded-2xl bg-muted/50 border border-border" />
      </div>

      {/* List skeleton */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-muted/50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
