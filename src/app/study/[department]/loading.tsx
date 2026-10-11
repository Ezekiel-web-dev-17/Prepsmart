export default function DepartmentLoading() {
  return (
    <div className="space-y-8 animate-pulse" role="status" aria-label="Loading curriculum...">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-muted rounded-md" />
        <div className="h-4 w-3 bg-muted rounded-md" />
        <div className="h-4 w-28 bg-muted rounded-md" />
        <div className="h-4 w-3 bg-muted rounded-md" />
        <div className="h-4 w-24 bg-muted rounded-md" />
      </div>

      {/* Hero Header Skeleton */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="h-6 w-32 bg-muted rounded-full" />
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
        <div className="h-9 w-2/3 max-w-md bg-muted rounded-xl" />
        <div className="h-5 w-full max-w-2xl bg-muted rounded-lg" />
        <div className="flex flex-wrap gap-2 pt-2">
          <div className="h-7 w-20 bg-muted rounded-lg" />
          <div className="h-7 w-24 bg-muted rounded-lg" />
          <div className="h-7 w-20 bg-muted rounded-lg" />
          <div className="h-7 w-28 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Metrics Row Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="h-4 w-20 bg-muted rounded-md" />
            <div className="h-7 w-14 bg-muted rounded-lg" />
            <div className="h-3 w-28 bg-muted rounded-md" />
          </div>
        ))}
      </div>

      {/* 4-Week Journey Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-muted rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((w) => (
            <div key={w} className="bg-card border border-border rounded-xl p-4 space-y-2">
              <div className="h-4 w-16 bg-muted rounded-md" />
              <div className="h-5 w-32 bg-muted rounded-md" />
              <div className="h-3 w-full bg-muted rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Subject Cards Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-44 bg-muted rounded-lg" />
          <div className="h-4 w-28 bg-muted rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((card) => (
            <div
              key={card}
              className="bg-card border border-border rounded-2xl p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-muted" />
                  <div className="h-5 w-16 bg-muted rounded-full" />
                </div>
                <div className="h-6 w-36 bg-muted rounded-lg" />
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-4/5 bg-muted rounded-md" />
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-3 w-5/6 bg-muted rounded" />
                  <div className="h-3 w-4/6 bg-muted rounded" />
                </div>
              </div>
              <div className="h-10 w-full bg-muted rounded-xl mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
