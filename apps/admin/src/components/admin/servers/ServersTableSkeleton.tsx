export function ServersTableSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <tr
          key={`servers-skeleton-row-${i + 1}`}
          className="animate-pulse border-b border-white/5"
        >
          {/* ID */}
          <td className="px-6 py-4">
            <div className="h-3.5 w-10 rounded bg-white/10" />
          </td>

          {/* Servidor */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-white/10" />
              <div className="h-4 w-36 rounded bg-white/10" />
            </div>
          </td>

          {/* Categoria */}
          <td className="px-6 py-4">
            <div className="h-5 w-24 rounded bg-white/10" />
          </td>

          {/* Acciones */}
          <td className="px-6 py-4">
            <div className="flex justify-end gap-1.5">
              <div className="h-8 w-8 rounded-sm bg-white/10" />
              <div className="h-8 w-8 rounded-sm bg-white/10" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
