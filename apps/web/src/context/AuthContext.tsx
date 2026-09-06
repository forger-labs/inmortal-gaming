"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { webApi } from "@/libs/webApi";
import type { AuthContextValue } from "@/types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = useCallback(
    async (emailInput: string, passwordInput: string) => {
      const tokens = await webApi.login({
        email: emailInput,
        password: passwordInput,
      });
      setEmail(emailInput);
      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);
    },
    [],
  );

  const logout = useCallback(async () => {
    if (refreshToken) {
      try {
        await webApi.logout(refreshToken);
      } catch {
        // Limpieza local en caso de error en la API
      }
    }
    setEmail(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, [refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: email !== null && accessToken !== null,
      email,
      accessToken,
      refreshToken,
      login,
      logout,
    }),
    [email, accessToken, refreshToken, login, logout],
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
