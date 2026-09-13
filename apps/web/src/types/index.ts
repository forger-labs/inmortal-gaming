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
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export type CatalogSort = "relevance" | "price-asc" | "price-desc";
