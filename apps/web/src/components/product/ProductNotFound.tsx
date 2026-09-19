import { ChevronLeftIcon } from "@shared/icons";
import Link from "next/link";

import { ROUTES } from "@/constants";

interface ProductNotFoundProps {
  message?: string;
  onRetry?: () => void;
}

export function ProductNotFound({
  message = "No se pudo encontrar la informacion del producto solicitado.",
  onRetry,
}: ProductNotFoundProps) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border border-neon-pink/40 bg-neon-pink/10 text-neon-pink shadow-[0_0_20px_rgba(255,45,123,0.3)]">
        <span className="font-mono text-2xl font-bold">!</span>
      </div>

      <h1 className="mb-2 font-display text-2xl font-bold uppercase text-text-primary md:text-3xl">
        Producto No Encontrado
      </h1>

      <p className="mb-8 max-w-md font-body text-sm leading-relaxed text-text-secondary">
        {message}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-neon-primary rounded px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider"
          >
            Reintentar
          </button>
        )}

        <Link
          href={ROUTES.catalog}
          className="btn-neon inline-flex items-center gap-2 rounded px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span>Volver al Catalogo</span>
        </Link>
      </div>
    </div>
  );
}
