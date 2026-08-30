"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { AuthContextValue } from "@/types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);

  const login = useCallback((nextEmail: string) => {
    setEmail(nextEmail);
  }, []);

  const logout = useCallback(() => {
    setEmail(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: email !== null, email, login, logout }),
    [email, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return ctx;
}
