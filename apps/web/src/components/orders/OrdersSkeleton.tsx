export default function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-white/10 bg-bg-surface/50 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-bg-elevated border border-white/5" />
            <div className="flex flex-col gap-2">
              <div className="h-5 w-36 rounded bg-bg-elevated" />
              <div className="h-4 w-28 rounded bg-bg-elevated/60" />
            </div>
          </div>
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
            <div className="h-6 w-24 rounded bg-bg-elevated/60" />
            <div className="h-8 w-24 rounded bg-bg-elevated" />
          </div>
        </div>
      ))}
    </div>
  );
}
