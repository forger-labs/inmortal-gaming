import type { LandingItemEntity } from "@shared/types";

export interface ProductSliderProps {
  item: LandingItemEntity;
}

export interface ProductDisplay extends Product {
  /** Label visible en la card (ej. "Hardware", "Optics") */
  displayCategory: string;
  /** Color token del label */
  categoryColor: "neon-purple" | "neon-pink" | "neon-green" | "neon-amber";
}

export type ProductCategory =
  | "game-items"
  | "virtual-currency"
  | "gift-cards"
  | "digital-services";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stockStatus: StockStatus;
  image?: string;
  /** Game platform — only for game-items / virtual-currency */
  platform?: string;
  /** Card value — only for gift-cards */
  denomination?: number;
  /** Subscription length — only for digital-services */
  duration?: string;
}

export type StockStatus = "available" | "low" | "out-of-stock";
