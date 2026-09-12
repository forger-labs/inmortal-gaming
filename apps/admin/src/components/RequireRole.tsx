"use client";

import { cyberError } from "@shared/toasts";
import type { AdminUserRole } from "@shared/types";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

import Forbidden from "@/components/Forbidden";
import { ROUTES } from "@/constants/routes";
import { useAuthGuard } from "../context/AuthGuardContext";

interface RequireRoleProps {
  /** Rol exigido. Si se omite, basta con una sesión autenticada. */
  requiredRole?: AdminUserRole[];
  children: ReactNode;
}

export function RequireRole({ requiredRole, children }: RequireRoleProps) {
  const { session, sessionReady } = useAuthGuard();
  const router = useRouter();
  const deniedNotified = useRef(false);

  const denied =
    sessionReady &&
    session !== null &&
    requiredRole !== undefined &&
    !requiredRole.some((role) => role === session.role);

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
    return (
      <Forbidden
        requiredRole={requiredRole.join(" / ")}
        onBack={() => router.push(ROUTES.admin)}
      />
    );
  }

  return children;
}
