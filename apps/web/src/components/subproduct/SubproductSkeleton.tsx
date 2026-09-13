export function SubproductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-6 py-10 md:px-12 md:py-14">
      {/* Breadcrumbs skeleton */}
      <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="h-4 w-56 rounded bg-bg-surface-hover" />
        <div className="h-5 w-24 rounded bg-bg-surface-hover" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column Skeleton */}
        <div className="space-y-6 lg:col-span-5">
          <div className="aspect-video w-full rounded-xl bg-bg-surface-hover lg:aspect-4/3" />
          <div className="h-36 w-full rounded-xl bg-bg-surface-hover" />
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6 lg:col-span-7">
          {/* Hero Skeleton */}
          <div className="space-y-4 rounded-xl border border-border-subtle bg-bg-surface p-6">
            <div className="flex gap-2">
              <div className="h-5 w-24 rounded bg-bg-surface-hover" />
              <div className="h-5 w-32 rounded bg-bg-surface-hover" />
            </div>
            <div className="h-10 w-3/4 rounded bg-bg-surface-hover" />
            <div className="h-16 w-full rounded bg-bg-surface-hover" />
          </div>

          {/* Specs Skeleton */}
          <div className="space-y-3 rounded-xl border border-border-subtle bg-bg-surface p-6">
            <div className="h-5 w-48 rounded bg-bg-surface-hover" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-28 rounded-lg bg-bg-surface-hover" />
              <div className="h-28 rounded-lg bg-bg-surface-hover" />
              <div className="h-28 rounded-lg bg-bg-surface-hover" />
              <div className="h-28 rounded-lg bg-bg-surface-hover" />
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="h-32 rounded-xl bg-bg-surface-hover" />
        </div>
      </div>
    </div>
  );
}
