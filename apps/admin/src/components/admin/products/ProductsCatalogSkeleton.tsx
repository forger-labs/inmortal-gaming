const SKELETON_CARDS = [
  "prod-card-sk-1",
  "prod-card-sk-2",
  "prod-card-sk-3",
  "prod-card-sk-4",
  "prod-card-sk-5",
  "prod-card-sk-6",
];

export function ProductsCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SKELETON_CARDS.map((key) => (
        <div
          key={key}
          className="flex flex-col rounded-xl border border-white/5 bg-bg-primary/60 p-4 animate-pulse"
        >
          <div className="aspect-video w-full rounded-lg bg-white/10 mb-4" />
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 w-20 rounded bg-white/10" />
            <div className="h-4 w-14 rounded bg-white/10" />
          </div>
          <div className="h-5 w-36 rounded bg-white/10 mb-2" />
          <div className="h-3 w-full rounded bg-white/5 mb-1" />
          <div className="h-3 w-3/4 rounded bg-white/5 mb-4" />
          <div className="mt-auto flex items-center justify-end gap-2 border-t border-white/5 pt-3">
            <div className="h-8 w-8 rounded bg-white/10" />
            <div className="h-8 w-8 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
