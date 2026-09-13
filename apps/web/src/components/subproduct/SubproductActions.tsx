"use client";

import { CartIcon, WhatsAppIcon } from "@shared/icons";
import { cyberSuccess } from "@shared/toasts";
import type { SubProductEntity } from "@shared/types";
import { useState } from "react";

interface SubproductActionsProps {
  subproduct: SubProductEntity;
  serverName?: string;
}

export function SubproductActions({
  subproduct,
  serverName,
}: SubproductActionsProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);

    // Simulate cyber addition & notify user
    setTimeout(() => {
      setIsAdding(false);
      cyberSuccess(
        `"${subproduct.name}" agregado al carrito correctamente.`,
        "[CARRITO]",
      );
    }, 250);
  };

  const handleWhatsAppInquiry = () => {
    const serverInfo = serverName ? ` en servidor ${serverName}` : "";
    const message = encodeURIComponent(
      `Hola Inmortal Gaming, estoy interesado en el subproducto "${subproduct.name}"${serverInfo} (Precio: $${subproduct.price} USD).`,
    );
    window.open(
      `https://wa.me/?text=${message}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-surface/70 p-5 backdrop-blur-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
          Opciones de Compra
        </span>
        <span className="font-mono text-[11px] text-neon-green">
          {subproduct.is_active ? "DISPONIBLE" : "NO DISPONIBLE"}
        </span>
      </div>

      {/* Add to Cart Button (NO QUANTITY DISPLAYED) */}
      <button
        type="button"
        disabled={!subproduct.is_active || isAdding}
        onClick={handleAddToCart}
        className={`relative flex w-full items-center justify-center gap-2.5 rounded-lg py-4 font-display text-base font-bold uppercase tracking-wider transition-all duration-200 ${
          subproduct.is_active
            ? "btn-neon-primary hover:scale-[1.01] active:scale-[0.99]"
            : "cursor-not-allowed border border-border-subtle bg-bg-surface-hover text-text-muted opacity-60"
        }`}
      >
        <CartIcon className={`h-5 w-5 ${isAdding ? "animate-bounce" : ""}`} />
        <span>
          {isAdding
            ? "AGREGANDO AL CARRITO..."
            : subproduct.is_active
              ? "AGREGAR AL CARRITO"
              : "PRODUCTO AGOTADO"}
        </span>
      </button>

      {/* WhatsApp Inquiry Button */}
      <button
        type="button"
        onClick={handleWhatsAppInquiry}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon-green/40 bg-transparent py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-neon-green transition-all duration-200 hover:bg-neon-green/10 hover:border-neon-green"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>Consultar por WhatsApp</span>
      </button>
    </div>
  );
}
