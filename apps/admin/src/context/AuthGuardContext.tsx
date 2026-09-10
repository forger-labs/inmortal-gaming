"use client";

import type { AdminUserRole } from "@shared/types";
import { jwtDecode } from "@shared/utils";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Toaster } from "react-hot-toast";

import { LOCAL_STORAGE_KEYS } from "@/constants";
import { adminApi } from "@/libs/adminApi";

export interface AdminSession {
  username: string;
  email: string;
  role: AdminUserRole;
  accessToken: string;
  refreshToken: string;
}

interface CustomJwtClaims {
  id?: number;
  email?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

interface AuthGuardContextValue {
  session: AdminSession | null;
  sessionReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: AdminUserRole) => boolean;
}

const STORAGE_KEY = "inmortal.admin.session";

const AuthGuardContext = createContext<AuthGuardContextValue | undefined>(
  undefined,
);

function readStoredSession(): AdminSession | null {
  // if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    const accessToken = parsed?.accessToken;

    if (typeof accessToken === "string") {
      try {
        const jwt = jwtDecode<CustomJwtClaims>(accessToken);
        if (!jwt?.exp) return null;

        if (jwt?.exp && jwt.exp < Math.floor(Date.now() / 1000)) {
          return null;
        }
      } catch {
        return null;
      }
    }

    if (
      typeof parsed?.email !== "string" ||
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
 * Autenticación del panel de administración integrada con endpoints del backend mediante `adminApi` y `jwtDecode`.
 */
export function AuthGuardProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(
    readStoredSession,
  );
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setSessionReady(true);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const tokens = await adminApi.login({ email, password });
    let claims: CustomJwtClaims | null = null;
    try {
      claims = jwtDecode<CustomJwtClaims>(tokens.access_token);
    } catch {
      claims = null;
    }

    const rawRole = claims?.role?.toUpperCase() ?? "ADMIN";
    const role: AdminUserRole =
      rawRole === "SUPERADMIN" || rawRole === "SUPER_ADMIN"
        ? "SUPER_ADMIN"
        : "ADMIN";

    const emailValue = claims?.email ?? email;
    const username = emailValue.split("@")[0] || emailValue;

    const nextSession: AdminSession = {
      username,
      email: emailValue,
      role,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, tokens.access_token);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.refreshToken,
        tokens.refresh_token,
      );
    } catch {
      // Almacenamiento no disponible: la sesión vive solo en memoria.
    }
    setSession(nextSession);
  }, []);

  const signOut = useCallback(async () => {
    const currentRefreshToken = session?.refreshToken;
    try {
      if (currentRefreshToken) {
        await adminApi.logout(currentRefreshToken);
      }
    } catch {
      // Se limpia la sesión local incluso si el backend retorna error o no está alcanzable.
    } finally {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
      } catch {
        // Nada que limpiar.
      }
      setSession(null);
    }
  }, [session?.refreshToken]);

  const hasRole = useCallback(
    (role: AdminUserRole) => session?.role === role,
    [session],
  );

  return (
    <AuthGuardContext.Provider
      value={{ session, sessionReady, signIn, signOut, hasRole }}
    >
      {children}
      <Toaster position="top-right" />
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
