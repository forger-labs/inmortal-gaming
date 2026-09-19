import { ChevronLeftIcon } from "@shared/icons";
import Link from "next/link";

import { ROUTES } from "@/constants";

interface ProductBreadcrumbsProps {
  categoryName?: string;
  productName: string;
  isActive: boolean;
}

export function ProductBreadcrumbs({
  categoryName,
  productName,
  isActive,
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label="Ruta de navegacion"
      className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4"
    >
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <Link
          href={ROUTES.catalog}
          className="inline-flex items-center gap-1 text-neon-primary transition-colors hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>CATALOGO</span>
        </Link>

        {categoryName && (
          <>
            <span className="text-text-muted">/</span>
            <span className="text-text-secondary uppercase">
              {categoryName}
            </span>
          </>
        )}

        <span className="text-text-muted">/</span>
        <span className="text-text-primary font-semibold truncate max-w-[200px] sm:max-w-xs">
          {productName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 font-mono text-xs font-semibold ${
            isActive
              ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
              : "border-text-muted/40 bg-bg-surface-hover text-text-muted"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isActive ? "bg-neon-green animate-pulse" : "bg-text-muted"
            }`}
          />
          {isActive ? "DISPONIBLE" : "INACTIVO"}
        </span>
      </div>
    </nav>
  );
}
