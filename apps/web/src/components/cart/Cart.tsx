"use client";

import { DeleteIcon } from "@/components/icons";
import { MOCK_CART } from "@/data/cart";

import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function Cart() {
  const cart = MOCK_CART;

  return (
    <section id="cart" className="px-6 md:px-12">
      <div className="mx-auto max-w-7xl py-16">
        {/* Phase 1: Title + Subtitle */}
        <header className="mb-12">
          <h1 className="mb-4 font-display text-5xl font-bold tracking-tight text-text-primary md:text-7xl">
            Neural Cart
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-text-secondary">
            Review your requested upgrades before transmitting the order
            sequence.
          </p>
        </header>

        {/* Phase 2 + 3: Cart Items + Summary grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Cart Items */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {cart.map((entry) => (
              <CartItem key={entry.product.id} entry={entry} />
            ))}

            {/* Clear Sequence */}
            <div className="flex justify-start">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded border border-neon-pink px-6 py-3 font-label text-[13px] font-semibold uppercase tracking-wider text-neon-pink transition-colors hover:bg-neon-pink/10"
              >
                <DeleteIcon className="h-[18px] w-[18px]" />
                Clear Sequence
              </button>
            </div>
          </div>

          {/* Right: Transmission Summary */}
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
