import { SearchIcon } from "@shared/icons";

import type { TableEmptyStateProps } from "@/types/list";

export function TableEmptyState({
  colSpan,
  title = "Sin resultados",
  description,
  icon,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-16 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-bg-primary text-text-muted">
          {icon ?? <SearchIcon className="h-6 w-6" />}
        </span>
        <p className="mt-4 font-display text-base font-semibold text-text-primary">
          {title}
        </p>
        <p className="mx-auto mt-1 max-w-sm font-body text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </td>
    </tr>
  );
}
