/* ─── Inmortal Gaming — Shared Types ─── */
export * from "./products";

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
  login: (email: string) => void;
  logout: () => void;
}

export type CatalogSort = "relevance" | "price-asc" | "price-desc";
