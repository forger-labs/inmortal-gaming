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
