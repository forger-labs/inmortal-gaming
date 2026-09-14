"use client";

import type { RegisterUserDTO, UserEntity, UserMeDTO } from "@shared/types";
import { jwtDecode } from "@shared/utils";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LOCAL_STORAGE_KEYS } from "@/constants/environment";
import { webApi } from "@/libs/webApi";
import type { AuthContextValue } from "@/types";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserMeDTO | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const getMe = useCallback(async (): Promise<UserMeDTO | null> => {
    try {
      const profile = await webApi.getMe();
      setUser(profile);
      setEmail(profile.email);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedAccessToken = localStorage.getItem(
          LOCAL_STORAGE_KEYS.accessToken,
        );
        const storedRefreshToken = localStorage.getItem(
          LOCAL_STORAGE_KEYS.refreshToken,
        );

        if (storedAccessToken) {
          try {
            const decoded = jwtDecode<{ exp?: number; email?: string }>(
              storedAccessToken,
            );
            if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
              localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
              localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
              return;
            }
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
            return;
          }

          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);

          const profile = await webApi.getMe();
          setUser(profile);
          setEmail(profile.email);
        }
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
        setUser(null);
        setEmail(null);
        setAccessToken(null);
        setRefreshToken(null);
      }
    };

    void restoreSession();
  }, []);

  const login = useCallback(
    async (identifier: string, passwordInput: string) => {
      const isEmail = identifier.includes("@");
      const tokens = await webApi.login({
        email: isEmail ? identifier : undefined,
        username: !isEmail ? identifier : undefined,
        password: passwordInput,
      });

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.accessToken,
          tokens.access_token,
        );
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.refreshToken,
          tokens.refresh_token,
        );
      } catch {
        // Almacenamiento local no disponible
      }

      setAccessToken(tokens.access_token);
      setRefreshToken(tokens.refresh_token);

      try {
        const profile = await webApi.getMe();
        setUser(profile);
        setEmail(profile.email);
      } catch {
        setEmail(identifier);
      }
    },
    [],
  );

  const register = useCallback(
    async (data: RegisterUserDTO): Promise<UserEntity> => {
      return await webApi.register(data);
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
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
    } catch {
      // Nada que limpiar
    }
    setUser(null);
    setEmail(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, [refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated:
        (email !== null || user !== null) && accessToken !== null,
      email: user?.email ?? email,
      user,
      accessToken,
      refreshToken,
      login,
      register,
      getMe,
      logout,
    }),
    [email, user, accessToken, refreshToken, login, register, getMe, logout],
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
