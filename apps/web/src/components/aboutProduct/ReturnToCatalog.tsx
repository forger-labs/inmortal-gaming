import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";

export function ReturnToCatalog() {
  return (
    <div className="mb-4">
      <Link
        href="/catalogo"
        className="text-neon-primary hover:text-neon-primary/80 transition-colors inline-flex items-center gap-2 font-mono text-sm"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        RETURN TO CATALOG
      </Link>
    </div>
  );
}
