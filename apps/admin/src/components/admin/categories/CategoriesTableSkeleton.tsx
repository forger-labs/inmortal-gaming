export function CategoriesTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr
          key={`categories-loading-row-${i + 1}`}
          className="animate-pulse border-b border-white/5"
        >
          <td className="px-6 py-4">
            <div className="h-4 w-12 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-white/10" />
              <div className="h-4 w-40 rounded bg-white/10" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto h-7 w-16 rounded bg-white/10" />
          </td>
        </tr>
      ))}
    </>
  );
}
