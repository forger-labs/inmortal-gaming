const SKELETON_ROWS = [
  "order-sk-1",
  "order-sk-2",
  "order-sk-3",
  "order-sk-4",
  "order-sk-5",
];

export function OrdersListSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 lg:p-6">
      {SKELETON_ROWS.map((key) => (
        <div
          key={key}
          className="flex animate-pulse flex-col gap-4 rounded-xl border border-white/5 bg-bg-surface/50 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Cabecera placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/5" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="h-3 w-20 rounded bg-white/5" />
            </div>
          </div>

          {/* Info cliente placeholder */}
          <div className="flex items-center gap-6">
            <div className="h-4 w-24 rounded bg-white/5" />
            <div className="h-4 w-28 rounded bg-white/5" />
            <div className="h-4 w-20 rounded bg-white/5" />
          </div>

          {/* Monto y boton placeholder */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-20 rounded bg-white/10" />
            <div className="h-9 w-28 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
