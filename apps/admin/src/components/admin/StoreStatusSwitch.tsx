"use client";

import { BoltIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import { useEffect, useState } from "react";

import { adminApi } from "@/libs/adminApi";

interface StoreStatusSwitchProps {
  className?: string;
}

export default function StoreStatusSwitch({
  className = "",
}: StoreStatusSwitchProps) {
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchStatus() {
      try {
        const status = await adminApi.getStoreStatus();
        if (isMounted) {
          setIsActive(status.is_active);
        }
      } catch (_error) {
        if (isMounted) {
          cyberError("Error al cargar estado de la tienda", "[SISTEMA TIENDA]");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = async () => {
    if (isLoading || isUpdating) return;
    setIsUpdating(true);

    try {
      const updated = await adminApi.toggleStoreStatus();
      setIsActive(updated.is_active);
      if (updated.is_active) {
        cyberSuccess(
          "Tienda activada y disponible para clientes",
          "[ESTADO TIENDA]",
        );
      } else {
        cyberSuccess(
          "Tienda en modo fuera de horario de atencion",
          "[ESTADO TIENDA]",
        );
      }
    } catch (_error) {
      cyberError("No se pudo cambiar el estado de la tienda", "[ERROR ESTADO]");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg border border-white/5 bg-[#12141f] px-3.5 py-2 ${className}`}
      >
        <span className="sr-only">Cargando estado de la tienda</span>
        <div className="h-4 w-4 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
        <div className="h-6 w-11 animate-pulse rounded-full bg-white/10" />
      </div>
    );
  }

  const active = Boolean(isActive);

  return (
    <div
      className={`flex items-center gap-3.5 rounded-lg border transition-all duration-200 ${
        active
          ? "border-neon-green/30 bg-[#12141f] shadow-[0_0_15px_rgba(0,255,136,0.08)]"
          : "border-neon-pink/30 bg-[#12141f] shadow-[0_0_15px_rgba(255,45,123,0.08)]"
      } px-3.5 py-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-md border ${
            active
              ? "border-neon-green/40 bg-neon-green/10 text-neon-green shadow-[0_0_10px_rgba(0,255,136,0.2)]"
              : "border-neon-pink/40 bg-neon-pink/10 text-neon-pink shadow-[0_0_10px_rgba(255,45,123,0.2)]"
          }`}
        >
          <BoltIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </span>

        <div className="flex flex-col">
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Servicio Tienda
          </span>
          <span
            className={`font-mono text-xs font-semibold uppercase tracking-wider ${
              active ? "text-neon-green" : "text-neon-pink"
            }`}
          >
            {active ? "ONLINE // ACTIVO" : "OFFLINE // FUERA DE HORARIO"}
          </span>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`Alternar estado de la tienda. Estado actual: ${
          active ? "Activo" : "Fuera de horario"
        }`}
        disabled={isUpdating}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none ${
          active
            ? "border-neon-green bg-neon-green/20 shadow-[0_0_12px_rgba(0,255,136,0.3)]"
            : "border-neon-pink bg-neon-pink/20 shadow-[0_0_12px_rgba(255,45,123,0.3)]"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow-md transition duration-200 ease-in-out motion-reduce:transition-none ${
            active
              ? "translate-x-5 bg-neon-green shadow-[0_0_8px_#00ff88]"
              : "translate-x-0.5 bg-neon-pink shadow-[0_0_8px_#ff2d7b]"
          } mt-0.5`}
        />
      </button>
    </div>
  );
}
