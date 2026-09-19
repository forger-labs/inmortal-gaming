"use client";

import {
  BoltIcon,
  CloseIcon,
  PendingActionsIcon,
  WhatsAppIcon,
} from "@shared/icons";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { BUSINESS_WHATSAPP, EASE_OUT_EXPO } from "@/constants";
import { webApi } from "@/libs/webApi";

const whatsappSupportMessage = [
  "*INMORTAL GAMING — CONSULTA DE HORARIO*",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "Hola, veo que se encuentran fuera del horario de atencion. Quisiera dejar una consulta para su proximo turno.",
]
  .filter(Boolean)
  .join("\n");

export default function StoreMaintenanceCartel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkStatus() {
      try {
        const status = await webApi.getStoreStatus();
        if (isMounted && status.is_active === false) {
          setIsOpen(true);
        } else if (isMounted && status.is_active === true) {
          setIsOpen(false);
        }
      } catch (_err) {
        // En caso de fallo en la red o endpoint, mantenemos estado pasivo
      }
    }

    checkStatus();

    // Verificacion periodica cada 60 segundos por si el admin reactiva la tienda
    const interval = setInterval(checkStatus, 60000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isMinimized ? (
          /* ─── Cartel Minimizador Persistente ─── */
          <motion.aside
            key="out-of-hours-minimized"
            aria-label="Aviso de fuera de horario de atencion"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            className="sticky top-0 z-50 w-full border-b border-neon-amber/40 bg-bg-surface/95 px-4 py-2.5 backdrop-blur-md shadow-[0_4px_20px_rgba(255,187,0,0.15)]"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-amber opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-neon-amber shadow-[0_0_8px_#ffbb00]" />
                </span>
                <p className="truncate font-mono text-xs font-semibold uppercase tracking-wider text-neon-amber">
                  [AVISO] Fuera del horario de atencion — Recepcion de pedidos
                  en pausa
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMinimized(false)}
                  className="rounded border border-neon-amber/40 bg-neon-amber/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-neon-amber transition-colors hover:bg-neon-amber hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-amber cursor-pointer"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </motion.aside>
        ) : (
          /* ─── Cartel Principal Overdrive ─── */
          <motion.div
            key="out-of-hours-cartel-overlay"
            aria-label="Fuera del horario de atencion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-4 pt-16 sm:p-6 sm:pt-20 md:pt-24 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-xl overflow-hidden rounded-xl border border-neon-amber/50 bg-bg-surface p-6 sm:p-8 shadow-[0_0_50px_rgba(255,187,0,0.22)]"
            >
              {/* Scanline texture & ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,187,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-neon-amber/10 blur-3xl"
                aria-hidden="true"
              />

              {/* Header bar */}
              <div className="relative z-10 flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neon-amber/40 bg-neon-amber/10 text-neon-amber shadow-[0_0_15px_rgba(255,187,0,0.25)]">
                    <PendingActionsIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-neon-amber">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-neon-amber shadow-[0_0_6px_#ffbb00]" />
                      ESTADO DEL SERVICIO
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                      Fuera del horario de atencion
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="rounded-md border border-white/10 p-1.5 text-text-secondary transition-colors hover:border-neon-amber/50 hover:bg-neon-amber/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-amber cursor-pointer"
                  aria-label="Minimizar aviso"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Cartel Body */}
              <div className="relative z-10 mt-5 space-y-4">
                <p className="font-body text-sm leading-relaxed text-text-primary sm:text-base">
                  Nuestros operadores y equipo de atencion se encuentran fuera
                  del horario operativo en este momento. La plataforma permanece
                  abierta para que consultes el catalogo y precios, pero la
                  recepcion de nuevos pedidos y entregas se procesara en el
                  siguiente turno de atencion.
                </p>

                {/* Technical status telemetry pills */}
                <div className="grid grid-cols-1 gap-2.5 rounded-lg border border-white/5 bg-bg-primary/80 p-3.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                    <BoltIcon
                      className="h-3.5 w-3.5 text-neon-amber"
                      aria-hidden="true"
                    />
                    <span>ESTADO: </span>
                    <span className="font-semibold text-neon-amber">
                      FUERA DE HORARIO
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
                    <span className="h-2 w-2 rounded-full bg-neon-amber" />
                    <span>ATENCION: </span>
                    <span className="font-semibold text-white">
                      PROXIMO TURNO
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs text-text-muted">
                  Puedes dejar tu mensaje por WhatsApp y te responderemos tan
                  pronto iniciemos nuestro horario de atencion.
                </p>
              </div>

              {/* Actions Footer */}
              <div className="relative z-10 mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-sm border border-white/10 bg-transparent px-4 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white sm:w-auto cursor-pointer"
                >
                  Continuar explorando
                </button>

                <Link
                  href={`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(
                    whatsappSupportMessage,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm border border-neon-green/50 bg-neon-green px-5 font-mono text-xs font-semibold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(0,255,136,0.3)] transition-all duration-150 hover:bg-neon-green/90 hover:shadow-[0_0_25px_rgba(0,255,136,0.5)] active:scale-95 sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  <span>Dejar mensaje en WhatsApp</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
