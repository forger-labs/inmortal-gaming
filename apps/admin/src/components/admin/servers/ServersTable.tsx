"use client";

import type { ProductEntity, ServerEntity } from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { ServersRow } from "./ServersRow";
import { ServersTableSkeleton } from "./ServersTableSkeleton";

interface ServersTableProps {
  servers: ServerEntity[];
  products: ProductEntity[];
  loading?: boolean;
  onEdit: (server: ServerEntity) => void;
  onDelete: (server: ServerEntity) => void;
}

export function ServersTable({
  servers,
  products,
  loading = false,
  onEdit,
  onDelete,
}: ServersTableProps) {
  const productMap = new Map(products.map((p) => [p.id, p.name]));

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-160 border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="w-24 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Nombre de servidor
            </th>
            <th
              scope="col"
              className="w-56 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Producto
            </th>
            <th
              scope="col"
              className="w-36 px-6 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <ServersTableSkeleton />
          ) : servers.length === 0 ? (
            <TableEmptyState
              colSpan={4}
              title="Sin resultados"
              description="No se encontraron servidores registrados o que coincidan con el filtro. Prueba con otro termino o crea un nuevo servidor."
            />
          ) : (
            servers.map((server, index) => (
              <ServersRow
                index={index}
                key={server.id}
                server={server}
                productName={productMap.get(server.product_id) || ""}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
