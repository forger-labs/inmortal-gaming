"use client";

import { ServerIcon } from "@shared/icons";
import type { ServerEntity } from "@shared/types";

interface SubproductServersProps {
  assignedServers: ServerEntity[];
  selectedServerId?: number | null;
  serverPrices?: Map<number, number>;
  onSelectServer?: (serverId: number) => void;
}

export function SubproductServers({
  assignedServers = [],
  selectedServerId,
  serverPrices,
  onSelectServer,
}: SubproductServersProps) {
  if (assignedServers.length === 0) {
    return (
      <section className="rounded-xl border border-border-subtle bg-bg-surface/70 p-5 backdrop-blur-sm">
        <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
          <ServerIcon className="h-4 w-4 text-neon-primary" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
            Servidores del Subproducto
          </h2>
        </div>
        <p className="mt-4 font-mono text-xs text-text-muted italic">
          No hay servidores asignados actualmente a este subproducto.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border-subtle bg-bg-surface/70 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-4 w-4 text-neon-primary" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
            Servidores Disponibles ({assignedServers.length})
          </h2>
        </div>
        <span className="font-mono text-[11px] text-neon-green">
          {assignedServers.length}{" "}
          {assignedServers.length === 1 ? "nodo activo" : "nodos activos"}
        </span>
      </div>

      <div className="space-y-3">
        <p className="font-body text-xs text-text-muted">
          Este subproducto cuenta con tarifas diferenciadas por servidor.
          Selecciona tu servidor para ver el precio aplicable:
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {assignedServers.map((server) => {
            const isSelected = selectedServerId === server.id;
            const price = serverPrices?.get(server.id);
            const formattedPrice =
              price !== undefined ? `$${price.toFixed(2)} USD` : null;

            return (
              <button
                key={server.id}
                type="button"
                onClick={() => onSelectServer?.(server.id)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-neon-primary bg-neon-primary/10 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    : "border-border-subtle bg-bg-surface hover:border-neon-primary/40 hover:bg-bg-surface-hover"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border ${
                      isSelected
                        ? "border-neon-primary bg-neon-primary/20 text-neon-primary"
                        : "border-white/10 bg-bg-primary text-text-muted"
                    }`}
                  >
                    <ServerIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-display text-sm font-semibold text-text-primary truncate">
                      {server.server_name}
                    </span>
                    {formattedPrice && (
                      <span className="block font-mono text-xs font-bold text-neon-primary">
                        {formattedPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      isSelected
                        ? "border border-neon-primary/40 bg-neon-primary/20 text-neon-primary"
                        : "border border-neon-green/30 bg-neon-green/10 text-neon-green"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
                    {isSelected ? "SELECCIONADO" : "ONLINE"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
