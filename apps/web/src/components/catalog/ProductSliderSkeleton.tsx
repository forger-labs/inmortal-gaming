const SKELETON_SLIDES = ["slider-sk-1", "slider-sk-2", "slider-sk-3"];

export function ProductSliderSkeleton({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative border-border-subtle border-b pb-8 md:pb-12 animate-pulse">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          {title ? (
            <h3 className="font-display text-3xl font-bold text-text-primary">
              {title}
            </h3>
          ) : (
            <div className="h-8 w-48 rounded bg-white/10" />
          )}
          {description ? (
            <p className="mt-1 font-body text-base text-text-secondary">
              {description}
            </p>
          ) : (
            <div className="mt-2 h-4 w-64 rounded bg-white/5" />
          )}
        </div>

        {/* Placeholder Controls */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-sm border border-white/10 bg-white/5" />
            <div className="h-9 w-9 rounded-sm border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>

      {/* Cards Viewport */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SKELETON_SLIDES.map((key) => (
          <div
            key={key}
            className="flex flex-col overflow-hidden rounded-lg border-l border-white/10 bg-bg-surface p-4 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          >
            <div className="h-48 w-full rounded-md bg-white/10 mb-4" />
            <div className="h-4 w-20 rounded bg-white/10 mb-2" />
            <div className="h-5 w-3/4 rounded bg-white/10 mb-2" />
            <div className="h-3.5 w-full rounded bg-white/5 mb-1" />
            <div className="h-3.5 w-2/3 rounded bg-white/5 mb-4" />
            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <div className="h-6 w-20 rounded bg-white/10" />
              <div className="h-9 w-9 rounded-sm bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
