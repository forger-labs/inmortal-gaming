import type { ProductDisplay } from "@/types";

export interface CartEntry {
  product: ProductDisplay;
  quantity: number;
}

export const MOCK_CART: CartEntry[] = [
  {
    product: {
      id: "synaptic-audio-headset",
      name: "Synaptic Audio Headset X-99",
      description: "Immersive neural audio interface with sub-dermal feedback.",
      category: "game-items",
      displayCategory: "Hardware",
      categoryColor: "neon-purple",
      price: 129.99,
      stockStatus: "available",
      image: "/neural-keydeck.jpg",
    },
    quantity: 1,
  },
  {
    product: {
      id: "neon-tactile-keyboard",
      name: "Neon Tactile Keyboard V2",
      description: "Haptic-feedback mechanical keyboard with per-key RGB.",
      category: "game-items",
      displayCategory: "Peripheral",
      categoryColor: "neon-pink",
      price: 189.5,
      stockStatus: "available",
      image: "/viper-synapse.jpg",
    },
    quantity: 2,
  },
];
