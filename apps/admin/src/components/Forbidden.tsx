"use client";

import { DashboardIcon, LockIcon, ShieldCheckIcon } from "@shared/icons";
import type { AdminUserRole } from "@shared/types";
import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";

import { EASE_OUT_EXPO } from "@/constants";
import { ROUTES } from "@/constants/routes";

export interface ForbiddenProps {
  title?: string;
  description?: string;
  requiredRole?: AdminUserRole | string;
  onBack?: () => void;
  backHref?: string;
  backLabel?: string;
}

export default function Forbidden({
  title = "Acceso denegado",
  description,
  requiredRole,
  onBack,
  backHref = ROUTES.admin,
  backLabel = "Volver al Dashboard",
}: ForbiddenProps) {
  const defaultDescription = requiredRole
    ? `Esta sección requiere los roles: ${requiredRole}. Tu sesión actual no cuenta con los permisos necesarios para realizar esta operación.`
    : "Tu cuenta no posee los privilegios requeridos para visualizar o gestionar este recurso en el panel de administración.";

  const finalDescription = description ?? defaultDescription;

  return (
    <MotionConfig reducedMotion="user">
      <main
        role="alert"
        aria-labelledby="forbidden-title"
        className="relative flex min-h-[75vh] w-full items-center justify-center overflow-hidden px-6 py-12"
      >
        {/* ─── Ambient Glow & Particle Backdrop ─── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
        >
          <div className="h-105 w-105 rounded-full bg-neon-pink/15 blur-[120px]" />
          <div className="h-75 w-75 rounded-full bg-neon-primary/10 blur-[100px]" />
        </div>

        {/* ─── Card Container ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="relative z-10 w-full max-w-lg rounded-xl border border-neon-pink/30 bg-bg-surface p-8 shadow-[0_0_50px_-10px_rgba(255,45,123,0.25)] sm:p-10"
        >
          {/* Top Status Strip */}
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <span
              data-text="HTTP 403 :: ACCESO_DENEGADO"
              className="glitch font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-neon-pink"
            >
              HTTP 403 :: Acceso_denegado
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-neon-pink/80">
              <span className="h-2 w-2 animate-ping rounded-full bg-neon-pink" />
              <span>Bloqueado</span>
            </div>
          </div>

          {/* Central Security Icon */}
          <div className="my-6 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-pink/40 bg-neon-pink/10 text-neon-pink shadow-[0_0_30px_rgba(255,45,123,0.3)]">
              <LockIcon className="h-10 w-10 animate-pulse" />
              <div
                aria-hidden="true"
                className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border border-neon-pink bg-bg-primary text-neon-pink shadow-md"
              >
                <ShieldCheckIcon className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <h1
              id="forbidden-title"
              className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            >
              {title}
            </h1>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
              {finalDescription}
            </p>
          </div>

          {/* System Diagnostic Terminal Block */}
          <div className="mt-6 rounded-lg border border-white/5 bg-bg-primary/80 p-4 font-mono text-[11px] leading-relaxed text-text-secondary">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 text-text-muted">
              <span>{"// REGISTRO DE SEGURIDAD"}</span>
              <span className="text-neon-pink">SEC_ERR_403</span>
            </div>
            <div className="mt-2 space-y-1">
              <p>
                <span className="text-text-muted">ESTADO:</span>{" "}
                <span className="text-neon-pink">PERMISOS_INSUFICIENTES</span>
              </p>
              {requiredRole && (
                <p>
                  <span className="text-text-muted">ROL_REQUERIDO:</span>{" "}
                  <span className="text-neon-primary">{requiredRole}</span>
                </p>
              )}
              <p>
                <span className="text-text-muted">DIRECTIVA:</span>{" "}
                <span className="text-text-primary">
                  SOLICITAR ELEVACION DE PRIVILEGIOS
                </span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:scale-[1.02] cursor-pointer"
              >
                <DashboardIcon className="h-4 w-4" />
                {backLabel}
              </button>
            ) : (
              <Link
                href={backHref}
                className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary transition-all hover:scale-[1.02]"
              >
                <DashboardIcon className="h-4 w-4" />
                {backLabel}
              </Link>
            )}
          </div>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
