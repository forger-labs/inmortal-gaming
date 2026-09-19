import { ServerIcon } from "@shared/icons";

export interface ServerOption {
  id: number | "all";
  name: string;
  subproductsCount: number;
}

interface ProductServersProps {
  servers: ServerOption[];
  selectedServerId: number | "all";
  onSelectServer: (serverId: number | "all") => void;
}

export function ProductServers({
  servers,
  selectedServerId,
  onSelectServer,
}: ProductServersProps) {
  if (servers.length <= 1) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-5 w-5 text-neon-primary" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-text-primary">
            Servidores del Producto
          </h2>
        </div>
        <span className="font-mono text-xs text-text-muted">
          FILTRAR POR SERVIDOR
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {servers.map((server) => {
          const isSelected = selectedServerId === server.id;
          return (
            <button
              key={String(server.id)}
              type="button"
              onClick={() => onSelectServer(server.id)}
              className={`group flex items-center gap-2.5 rounded-md border px-3.5 py-2 font-mono text-xs font-semibold uppercase transition-all duration-200 ${
                isSelected
                  ? "border-neon-primary bg-neon-primary/15 text-neon-primary shadow-[0_0_12px_rgba(0,240,255,0.25)]"
                  : "border-border-subtle bg-bg-surface text-text-secondary hover:border-border-neon hover:bg-bg-surface-hover hover:text-text-primary"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSelected
                    ? "bg-neon-primary animate-pulse"
                    : "bg-text-muted group-hover:bg-neon-primary/70"
                }`}
              />
              <span>{server.name}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                  isSelected
                    ? "bg-neon-primary/20 text-neon-primary"
                    : "bg-bg-elevated text-text-muted"
                }`}
              >
                {server.subproductsCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
