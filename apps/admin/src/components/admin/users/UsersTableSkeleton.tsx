export function UsersTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr
          key={`users-loading-row-${i + 1}`}
          className="animate-pulse border-b border-white/5"
        >
          <td className="px-6 py-4">
            <div className="h-4 w-24 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-28 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-4 w-44 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="h-5 w-20 rounded bg-white/10" />
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto h-7 w-16 rounded bg-white/10" />
          </td>
        </tr>
      ))}
    </>
  );
}
