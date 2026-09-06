"use client";

import { ShieldCheckIcon } from "@shared/icons";
import type { AdminUserRole } from "@shared/types";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import { cyberError } from "@/components/toasts/cyberToasts";
import { useAuthGuard } from "../../context/AuthGuardContext";

interface RequireRoleProps {
  /** Rol exigido. Si se omite, basta con una sesión autenticada. */
  requiredRole?: AdminUserRole;
  children: ReactNode;
}

function AccessDenied({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
        <ShieldCheckIcon className="h-7 w-7" />
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold text-text-primary">
          Acceso restringido
        </h1>
        <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-text-secondary">
          Esta sección es exclusiva del SUPER_ADMIN. Tu sesión no tiene los
          permisos necesarios para gestionar usuarios del sistema.
        </p>
      </div>
      <button
        type="button"
        onClick={onBack}
        className="btn-neon rounded px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
      >
        Volver al inicio
      </button>
    </div>
  );
}

export function RequireRole({ requiredRole, children }: RequireRoleProps) {
  const { session, sessionReady } = useAuthGuard();
  const router = useRouter();
  const deniedNotified = useRef(false);

  const denied =
    sessionReady &&
    session !== null &&
    requiredRole !== undefined &&
    session.role !== requiredRole;

  useEffect(() => {
    if (sessionReady && !session) {
      router.replace("/");
    }
  }, [sessionReady, session, router]);

  useEffect(() => {
    if (denied && !deniedNotified.current) {
      deniedNotified.current = true;
      cyberError("Acceso restringido. Seccion exclusiva para SUPER_ADMIN.");
    }
  }, [denied]);

  if (!sessionReady) {
    return null;
  }

  if (!session) {
    return null;
  }

  if (denied) {
    return <AccessDenied onBack={() => router.push("/admin")} />;
  }

  return children;
}
