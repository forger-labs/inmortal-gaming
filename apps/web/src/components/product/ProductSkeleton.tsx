export function ProductSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-6 py-10 md:px-12 md:py-14">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="h-4 w-48 rounded bg-bg-surface-hover" />
        <div className="h-5 w-24 rounded bg-bg-surface-hover" />
      </div>

      {/* Hero skeleton */}
      <div className="mb-12 grid grid-cols-1 gap-8 rounded-xl border border-border-subtle bg-bg-surface p-6 md:grid-cols-12 md:p-8">
        <div className="aspect-square w-full rounded-lg bg-bg-surface-hover md:col-span-5 lg:col-span-4" />
        <div className="flex flex-col justify-between md:col-span-7 lg:col-span-8">
          <div>
            <div className="mb-3 h-4 w-32 rounded bg-bg-surface-hover" />
            <div className="mb-4 h-10 w-3/4 rounded bg-bg-surface-hover" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-bg-surface-hover" />
              <div className="h-4 w-5/6 rounded bg-bg-surface-hover" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-6">
            <div className="h-16 rounded bg-bg-surface-hover" />
            <div className="h-16 rounded bg-bg-surface-hover" />
            <div className="h-16 rounded bg-bg-surface-hover" />
          </div>
        </div>
      </div>

      {/* Servers skeleton */}
      <div className="mb-10">
        <div className="mb-4 h-6 w-48 rounded bg-bg-surface-hover" />
        <div className="flex flex-wrap gap-2.5">
          <div className="h-9 w-32 rounded-md bg-bg-surface-hover" />
          <div className="h-9 w-28 rounded-md bg-bg-surface-hover" />
          <div className="h-9 w-36 rounded-md bg-bg-surface-hover" />
        </div>
      </div>

      {/* Subcategory skeleton */}
      <div className="mb-12">
        <div className="mb-6 flex justify-between border-b border-border-subtle pb-3">
          <div className="h-7 w-40 rounded bg-bg-surface-hover" />
          <div className="h-4 w-24 rounded bg-bg-surface-hover" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="h-72 rounded-lg bg-bg-surface" />
          <div className="h-72 rounded-lg bg-bg-surface" />
          <div className="h-72 rounded-lg bg-bg-surface" />
          <div className="h-72 rounded-lg bg-bg-surface" />
        </div>
      </div>
    </div>
  );
}
