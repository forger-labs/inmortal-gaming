import { ServerIcon } from "@shared/icons";
import type { ProductCatalogEntity } from "@shared/types";
import { getR2ImageUrl } from "@shared/utils";
import Image from "next/image";

interface ProductHeroProps {
  product: ProductCatalogEntity;
  totalServersCount: number;
  totalSubproductsCount: number;
}

export function ProductHero({
  product,
  totalServersCount,
  totalSubproductsCount,
}: ProductHeroProps) {
  const imageUrl = getR2ImageUrl(product.image);

  return (
    <section className="mb-12 overflow-hidden rounded-xl border border-border-subtle bg-bg-surface p-6 shadow-[inset_0_2px_15px_rgba(0,0,0,0.6)] md:p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
        {/* Product Visual Frame */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border-neon/40 bg-bg-surface-hover shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            {/* Neon Accent Glow */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-tr from-neon-primary/10 via-transparent to-neon-purple/10 opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-mono text-sm text-text-muted">
                IMAGEN NO DISPONIBLE
              </div>
            )}

            {/* Category tag over image */}
            {product.category && (
              <div className="absolute left-3 top-3 z-20">
                <span className="rounded-sm border border-neon-purple/50 bg-neon-purple/20 px-2.5 py-1 font-mono text-xs font-semibold uppercase text-neon-purple backdrop-blur-md shadow-[0_0_10px_rgba(123,45,255,0.3)]">
                  {product.category.category_name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col md:col-span-7 lg:col-span-8">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-neon-primary">
            ID #{product.id} {"//"} CATALOGO DE PRODUCTO
          </div>

          <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl lg:text-5xl">
            {product.name}
          </h1>

          <p className="mb-6 max-w-2xl font-body text-base leading-relaxed text-text-secondary md:text-lg">
            {product.description ||
              "Sin descripcion adicional disponible para este producto."}
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border-subtle pt-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border-subtle bg-bg-surface-hover/60 p-3">
              <div className="flex items-center gap-1.5 font-body text-xs text-text-secondary">
                <ServerIcon className="h-4 w-4 text-neon-primary" />
                <span>Servidores</span>
              </div>
              <p className="mt-1 font-mono text-xl font-bold text-text-primary">
                {totalServersCount}
              </p>
            </div>

            <div className="rounded-lg border border-border-subtle bg-bg-surface-hover/60 p-3">
              <span className="font-body text-xs text-text-secondary">
                Subcategorias
              </span>
              <p className="mt-1 font-mono text-xl font-bold text-neon-purple">
                {product.subcategories?.length || 0}
              </p>
            </div>

            <div className="col-span-2 rounded-lg border border-border-subtle bg-bg-surface-hover/60 p-3 sm:col-span-1">
              <span className="font-body text-xs text-text-secondary">
                Subproductos
              </span>
              <p className="mt-1 font-mono text-xl font-bold text-neon-green">
                {totalSubproductsCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
