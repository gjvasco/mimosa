export default function CatalogSkeleton() {
  return (
    <div className="min-w-0 space-y-6">
      {/* Buscador Skeleton */}
      <div className="h-12 w-full rounded-2xl bg-muted animate-pulse" />

      {/* Categorías Skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-muted animate-pulse shrink-0"
          />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-3 space-y-3"
          >
            <div className="aspect-square w-full rounded-xl bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
