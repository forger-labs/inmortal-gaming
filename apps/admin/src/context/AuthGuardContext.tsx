"use client";

import type { AdminUserRole } from "@shared/types";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AdminSession {
  username: string;
  role: AdminUserRole;
}

interface AuthGuardContextValue {
  session: AdminSession | null;
  sessionReady: boolean;
  signIn: (username: string, role?: AdminUserRole) => void;
  signOut: () => void;
  hasRole: (role: AdminUserRole) => boolean;
}

const STORAGE_KEY = "inmortal.admin.session";

const AuthGuardContext = createContext<AuthGuardContextValue | undefined>(
  undefined,
);

function readStoredSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (
      typeof parsed?.username !== "string" ||
      (parsed.role !== "SUPER_ADMIN" && parsed.role !== "ADMIN")
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Autenticación del panel. Hoy maneja una sesión simulada en sessionStorage;
 * cuando la integración esté lista, `signIn`/`signOut` se conectarán al
 * backend y la sesión pasará a ser el token/cookie real. Los guards
 * (`RequireRole`) ya trabajan contra esta interfaz.
 */
export function AuthGuardProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(
    readStoredSession,
  );
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setSessionReady(true);
  }, []);

  const signIn = useCallback(
    (username: string, role: AdminUserRole = "SUPER_ADMIN") => {
      const next: AdminSession = { username, role };
      try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Almacenamiento no disponible: la sesión vive solo en memoria.
      }
      setSession(next);
    },
    [],
  );

  const signOut = useCallback(() => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que limpiar.
    }
    setSession(null);
  }, []);

  const hasRole = useCallback(
    (role: AdminUserRole) => session?.role === role,
    [session],
  );

  return (
    <AuthGuardContext.Provider
      value={{ session, sessionReady, signIn, signOut, hasRole }}
    >
      {children}
    </AuthGuardContext.Provider>
  );
}

export function useAuthGuard() {
  const context = useContext(AuthGuardContext);
  if (!context) {
    throw new Error("useAuthGuard must be used within AuthGuardProvider");
  }
  return context;
}
