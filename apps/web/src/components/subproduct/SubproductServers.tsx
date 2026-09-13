import { ServerIcon } from "@shared/icons";
import type { ServerEntity } from "@shared/types";

interface SubproductServersProps {
  currentServer?: ServerEntity | null;
  availableServers?: ServerEntity[];
  serverId: number;
}

export function SubproductServers({
  currentServer,
  availableServers = [],
  serverId,
}: SubproductServersProps) {
  const activeServerName =
    currentServer?.server_name || `Servidor #${serverId}`;

  // Unique list of servers including current server
  const allServers =
    availableServers.length > 0
      ? availableServers
      : currentServer
        ? [currentServer]
        : [
            {
              id: serverId,
              server_name: `Servidor #${serverId}`,
              product_id: 0,
            },
          ];

  return (
    <section className="rounded-xl border border-border-subtle bg-bg-surface/70 p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-4 w-4 text-neon-primary" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
            Servidores del Subproducto
          </h2>
        </div>
        <span className="font-mono text-[11px] text-text-muted">
          {allServers.length} {allServers.length === 1 ? "nodo" : "nodos"}
        </span>
      </div>

      <div className="space-y-3">
        {/* Main Assigned Server Banner */}
        <div className="flex items-center justify-between rounded-lg border border-neon-primary/40 bg-neon-primary/5 p-3.5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-neon-primary/30 bg-bg-primary text-neon-primary">
              <ServerIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-neon-primary">
                SERVIDOR ASIGNADO
              </span>
              <span className="font-display text-base font-semibold text-text-primary">
                {activeServerName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-neon-green/40 bg-neon-green/10 px-2.5 py-1 font-mono text-xs font-semibold text-neon-green">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Other available servers if more than 1 */}
        {allServers.length > 1 && (
          <div>
            <span className="mb-2 block font-mono text-[10px] uppercase tracking-wider text-text-muted">
              Otros nodos de la red para este producto:
            </span>
            <div className="flex flex-wrap gap-2">
              {allServers.map((server) => {
                const isCurrent = server.id === serverId;
                return (
                  <div
                    key={server.id}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
                      isCurrent
                        ? "border-neon-primary bg-neon-primary/10 text-neon-primary"
                        : "border-border-subtle bg-bg-surface text-text-secondary"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCurrent ? "bg-neon-primary" : "bg-text-muted"
                      }`}
                    />
                    <span>{server.server_name}</span>
                    {isCurrent && (
                      <span className="ml-1 text-[10px] text-neon-primary font-bold">
                        (ACTIVO)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
