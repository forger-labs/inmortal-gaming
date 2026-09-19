"use client";

import { BoltIcon, LockIcon } from "@shared/icons";
import Link from "next/link";
import { useState } from "react";

import { LoginModal } from "@/components/auth/LoginModal";
import { ROUTES } from "@/constants";

interface ProfileUnauthenticatedProps {
  title?: string;
  description?: string;
}

export default function ProfileUnauthenticated({
  title = "Acceso Restringido",
  description = "Necesitas iniciar sesion para acceder a tu perfil y gestionar tu cuenta.",
}: ProfileUnauthenticatedProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-neon-primary/30 bg-bg-surface text-neon-primary shadow-[0_0_30px_rgba(0,240,255,0.2)]">
          <LockIcon className="h-10 w-10" />
        </div>

        <span
          data-text="AUTENTICACION REQUERIDA"
          className="glitch font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-primary"
        >
          Autenticacion requerida
        </span>

        <h1 className="mt-2 font-display text-2xl font-bold text-text-primary sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-md font-body text-sm text-text-secondary">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setLoginOpen(true)}
            className="btn-neon cursor-pointer rounded px-6 py-3 font-display text-xs font-semibold uppercase tracking-wider"
          >
            Iniciar Sesion
          </button>

          <Link
            href={ROUTES.catalog}
            className="inline-flex items-center gap-2 rounded border border-white/10 bg-bg-surface px-6 py-3 font-display text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-primary/40 hover:text-text-primary"
          >
            Explorar Catalogo
            <BoltIcon className="h-4 w-4 text-neon-primary" />
          </Link>
        </div>
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
