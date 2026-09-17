import { ChevronLeftIcon } from "@shared/icons";
import Link from "next/link";

import { ROUTES } from "@/constants";

interface SubproductBreadcrumbsProps {
  categoryName?: string;
  productName?: string;
  productId?: number | string;
  subproductName: string;
  isActive: boolean;
}

export function SubproductBreadcrumbs({
  categoryName,
  productName,
  productId,
  subproductName,
  isActive,
}: SubproductBreadcrumbsProps) {
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

        {productName && productId && (
          <>
            <span className="text-text-muted">/</span>
            <Link
              href={ROUTES.product(productId)}
              className="text-text-secondary transition-colors hover:text-neon-primary truncate max-w-[160px] sm:max-w-[200px]"
            >
              {productName}
            </Link>
          </>
        )}

        <span className="text-text-muted">/</span>
        <span className="font-semibold text-text-primary truncate max-w-[200px] sm:max-w-xs">
          {subproductName}
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
          {isActive ? "DISPONIBLE" : "AGOTADO"}
        </span>
      </div>
    </nav>
  );
}
