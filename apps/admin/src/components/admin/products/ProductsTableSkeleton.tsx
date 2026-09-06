const SKELETON_ROWS = [
  "prod-sk-1",
  "prod-sk-2",
  "prod-sk-3",
  "prod-sk-4",
  "prod-sk-5",
];

export function ProductsTableSkeleton() {
  return (
    <>
      {SKELETON_ROWS.map((key) => (
        <tr key={key} className="border-b border-white/5 animate-pulse">
          <td className="px-6 py-4">
            <div className="h-4 w-10 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-md bg-white/10" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-36 rounded bg-white/10" />
                <div className="h-3 w-52 rounded bg-white/5" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-24 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 w-16 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="flex justify-end gap-1.5">
              <div className="h-8 w-8 rounded bg-white/10" />
              <div className="h-8 w-8 rounded bg-white/10" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
