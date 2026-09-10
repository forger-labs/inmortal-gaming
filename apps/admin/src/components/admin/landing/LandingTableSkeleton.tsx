export function LandingTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <tr
          key={`landing-loading-row-${index + 1}`}
          className="animate-pulse border-b border-white/5"
        >
          <td className="px-6 py-4">
            <div className="flex items-center gap-1">
              <div className="h-6 w-6 rounded bg-white/10" />
              <div className="h-4 w-8 rounded bg-white/10" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-44 rounded bg-white/10" />
              <div className="h-3 w-64 rounded bg-white/5" />
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-28 rounded-md bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-12 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-24 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-6 w-20 rounded-full bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto flex items-center justify-end gap-1.5">
              <div className="h-8 w-8 rounded bg-white/10" />
              <div className="h-8 w-8 rounded bg-white/10" />
              <div className="h-8 w-8 rounded bg-white/10" />
              <div className="h-8 w-8 rounded bg-white/10" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
