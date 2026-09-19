export default function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-bg-surface border border-white/10" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 rounded bg-bg-surface" />
            <div className="h-4 w-32 rounded bg-bg-surface" />
          </div>
        </div>
        <div className="h-10 w-36 rounded bg-bg-surface" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left card */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-bg-surface/50 p-6">
          <div className="h-5 w-32 rounded bg-bg-elevated" />
          <div className="h-24 rounded bg-bg-elevated/60" />
          <div className="h-10 rounded bg-bg-elevated/60" />
        </div>

        {/* Right form container */}
        <div className="lg:col-span-2 flex flex-col gap-5 rounded-xl border border-white/10 bg-bg-surface/50 p-6">
          <div className="h-5 w-40 rounded bg-bg-elevated" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-14 rounded bg-bg-elevated/60" />
            <div className="h-14 rounded bg-bg-elevated/60" />
            <div className="h-14 rounded bg-bg-elevated/60" />
            <div className="h-14 rounded bg-bg-elevated/60" />
          </div>
          <div className="h-14 rounded bg-bg-elevated/60" />
          <div className="h-12 w-44 rounded bg-bg-elevated" />
        </div>
      </div>
    </div>
  );
}
