export default function DrillLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Top Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="space-y-2">
          <div className="h-6 w-36 bg-muted rounded-lg" />
          <div className="h-4 w-56 bg-muted/60 rounded-md" />
        </div>
        <div className="h-8 w-24 bg-muted/70 rounded-full" />
      </div>

      {/* Progress & stats skeleton */}
      <div className="h-3 w-full bg-muted/40 rounded-full overflow-hidden" />

      {/* Question Card skeleton */}
      <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-muted rounded-md" />
          <div className="h-6 w-20 bg-muted/50 rounded-md" />
        </div>

        <div className="space-y-3">
          <div className="h-5 w-full bg-muted/80 rounded-md" />
          <div className="h-5 w-4/5 bg-muted/70 rounded-md" />
          <div className="h-5 w-2/3 bg-muted/60 rounded-md" />
        </div>

        {/* Options skeleton */}
        <div className="space-y-3 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-muted/50 border border-border flex items-center px-4"
            >
              <div className="h-6 w-6 rounded-full bg-muted mr-3" />
              <div className="h-4 w-1/2 bg-muted/70 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer controls skeleton */}
      <div className="flex items-center justify-between pt-4">
        <div className="h-10 w-28 bg-muted/50 rounded-xl" />
        <div className="h-10 w-32 bg-muted/70 rounded-xl" />
      </div>
    </div>
  );
}
