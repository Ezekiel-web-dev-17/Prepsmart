export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-16 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-48 rounded-3xl bg-muted/60 border border-border" />

      {/* Action Strip Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="h-40 rounded-2xl bg-muted/50 border border-border" />
        <div className="h-40 rounded-2xl bg-muted/50 border border-border" />
        <div className="h-40 rounded-2xl bg-muted/50 border border-border" />
      </div>

      {/* Materials Section Skeleton */}
      <div className="h-72 rounded-3xl bg-card border border-border p-6 space-y-4">
        <div className="h-6 bg-muted rounded w-64" />
        <div className="h-4 bg-muted rounded w-96" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="h-36 bg-muted/40 rounded-2xl" />
          <div className="h-36 bg-muted/40 rounded-2xl" />
          <div className="h-36 bg-muted/40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
