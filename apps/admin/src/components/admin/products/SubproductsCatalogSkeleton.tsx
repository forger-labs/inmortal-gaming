const SKELETON_CARDS = [
  "subprod-card-1",
  "subprod-card-2",
  "subprod-card-3",
  "subprod-card-4",
  "subprod-card-5",
  "subprod-card-6",
  "subprod-card-7",
  "subprod-card-8",
];

export function SubproductsCatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {SKELETON_CARDS.map((key) => (
        <div
          key={key}
          className="flex flex-col rounded-xl border border-white/10 bg-bg-surface p-4 space-y-3.5 animate-pulse"
        >
          <div className="aspect-video w-full rounded-lg bg-white/10" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="h-4 w-14 rounded bg-white/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-20 rounded bg-white/10" />
            <div className="h-5 w-20 rounded bg-white/10" />
          </div>
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="h-6 w-16 rounded bg-white/10" />
            <div className="flex gap-1.5">
              <div className="h-7 w-7 rounded bg-white/10" />
              <div className="h-7 w-7 rounded bg-white/10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
