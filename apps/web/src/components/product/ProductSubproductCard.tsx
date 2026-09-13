import { ChevronRightIcon } from "@shared/icons";
import type { CatalogSubProduct } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";
import Link from "next/link";

import { ROUTES } from "@/constants";

interface ProductSubproductCardProps {
  subproduct: CatalogSubProduct;
  selectedServerId?: number | "all";
  serverName?: string;
}

export function ProductSubproductCard({
  subproduct,
  selectedServerId,
  serverName,
}: ProductSubproductCardProps) {
  const imageUrl = getR2ImageUrl(subproduct.image);
  const formattedPrice =
    typeof subproduct.price === "number"
      ? subproduct.price.toFixed(2)
      : Number(subproduct.price || 0).toFixed(2);

  const displayServerBadge = (() => {
    if (serverName) return serverName;
    if (!subproduct.servers || subproduct.servers.length === 0) return null;
    if (typeof selectedServerId === "number") {
      const matched = subproduct.servers.find((s) => s.id === selectedServerId);
      if (matched) return matched.server_name;
    }
    if (subproduct.servers.length === 1) {
      return subproduct.servers[0].server_name;
    }
    return `${subproduct.servers.length} Servidores`;
  })();

  return (
    <Link
      href={ROUTES.subproduct(subproduct.id)}
      className="group flex flex-col overflow-hidden rounded-lg border-l-2 border-neon-primary bg-bg-surface shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,240,255,0.15)]"
    >
      {/* Image container */}
      <div className="relative h-44 w-full overflow-hidden bg-bg-surface-hover">
        <div className="pointer-events-none absolute inset-0 z-10 bg-neon-primary/5 transition-colors duration-300 group-hover:bg-transparent" />

        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={subproduct.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-text-muted">
            SIN IMAGEN
          </div>
        )}

        {/* Server & Status badges */}
        <div className="absolute right-2 top-2 z-20 flex flex-col items-end gap-1.5">
          <span
            className={`rounded-sm border px-2 py-0.5 font-mono text-[11px] font-semibold ${
              subproduct.is_active
                ? "border-neon-green/40 bg-neon-green/10 text-neon-green"
                : "border-text-muted bg-bg-surface text-text-muted"
            }`}
          >
            {subproduct.is_active ? "Disponible" : "Agotado"}
          </span>

          {displayServerBadge && (
            <span className="rounded-sm border border-neon-purple/40 bg-neon-purple/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-neon-purple backdrop-blur-sm">
              {displayServerBadge}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col p-4">
        <h4 className="mb-2 font-display text-base font-semibold text-text-primary transition-colors group-hover:text-neon-primary line-clamp-1">
          {subproduct.name}
        </h4>

        {/* Bottom bar: Price & CTA */}
        <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
          <div>
            <span className="block font-body text-[10px] uppercase tracking-wider text-text-muted">
              Precio
            </span>
            <span className="font-mono text-lg font-bold text-neon-primary">
              $ {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-xs font-semibold text-neon-primary transition-transform duration-200 group-hover:translate-x-1">
            <span>VER DETALLE</span>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
