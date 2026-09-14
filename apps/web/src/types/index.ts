import type { RegisterUserDTO, UserEntity, UserMeDTO } from "@shared/types";

/* ─── Inmortal Gaming — Shared Types ─── */
export * from "./products";
export * from "./subproduct";

export interface NavLink {
  label: string;
  href: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  email: string | null;
  user: UserMeDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterUserDTO) => Promise<UserEntity>;
  getMe: () => Promise<UserMeDTO | null>;
  logout: () => Promise<void>;
}

export type CatalogSort = "relevance" | "price-asc" | "price-desc";
