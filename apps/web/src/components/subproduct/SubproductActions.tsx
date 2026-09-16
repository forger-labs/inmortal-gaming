"use client";

import { CartIcon, WhatsAppIcon } from "@shared/icons";
import { cyberError, cyberSuccess } from "@shared/toasts";
import type {
  ItemPriceEntity,
  ServerEntity,
  SubProductEntity,
} from "@shared/types";
import { useState } from "react";

import { BUSINESS_WHATSAPP } from "@/constants";
import { useCart } from "@/context/CartContext";

interface SubproductActionsProps {
  subproduct: SubProductEntity;
  selectedServer?: ServerEntity | null;
  selectedItemPrice?: ItemPriceEntity | null;
  currentPrice?: number;
}

export function SubproductActions({
  subproduct,
  selectedServer,
  selectedItemPrice,
  currentPrice,
}: SubproductActionsProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const activePrice =
    currentPrice !== undefined
      ? currentPrice
      : typeof subproduct.price === "number"
        ? subproduct.price
        : 0;

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      const itemPriceId = selectedItemPrice?.id ?? 0;
      await addToCart({
        sub_product_id: subproduct.id,
        item_price_id: itemPriceId,
        quantity: 1,
        product_name: subproduct.name,
        price: activePrice,
        image: subproduct.image,
        server_name: selectedServer?.server_name,
      });

      const serverDetail = selectedServer
        ? ` (${selectedServer.server_name} - $${activePrice.toFixed(2)} USD)`
        : "";
      cyberSuccess(
        `"${subproduct.name}"${serverDetail} agregado al carrito correctamente.`,
        "[CARRITO]",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "No se pudo agregar el producto al carrito";
      cyberError(msg, "[ERROR]");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    const serverInfo = selectedServer
      ? ` en servidor "${selectedServer.server_name}"`
      : "";
    const message = encodeURIComponent(
      `Hola Inmortal Gaming, estoy interesado en el subproducto "${subproduct.name}"${serverInfo} (Precio: $${activePrice.toFixed(2)} USD).`,
    );
    window.open(
      `https://wa.me/${BUSINESS_WHATSAPP}?text=${message}`,
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

      {selectedServer && (
        <div className="flex items-center justify-between rounded border border-white/5 bg-white/5 px-3 py-1.5 font-mono text-xs text-text-secondary">
          <span className="text-text-muted">Servidor seleccionado:</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neon-primary">
              {selectedServer.server_name}
            </span>
            <span className="font-bold text-neon-green">
              (${activePrice.toFixed(2)} USD)
            </span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        type="button"
        disabled={!subproduct.is_active || isAdding}
        onClick={handleAddToCart}
        className={`relative flex w-full items-center justify-center gap-2.5 rounded-lg py-4 font-display text-base font-bold uppercase tracking-wider transition-all duration-200 ${
          subproduct.is_active
            ? "btn-neon-primary hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            : "cursor-not-allowed border border-border-subtle bg-bg-surface-hover text-text-muted opacity-60"
        }`}
      >
        <CartIcon className={`h-5 w-5 ${isAdding ? "animate-bounce" : ""}`} />
        <span>
          {isAdding
            ? "AGREGANDO AL CARRITO..."
            : subproduct.is_active
              ? `AGREGAR AL CARRITO - $${activePrice.toFixed(2)} USD`
              : "PRODUCTO AGOTADO"}
        </span>
      </button>

      {/* WhatsApp Inquiry Button */}
      <button
        type="button"
        onClick={handleWhatsAppInquiry}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon-green/40 bg-transparent py-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-neon-green transition-all duration-200 hover:bg-neon-green/10 hover:border-neon-green cursor-pointer"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>Consultar por WhatsApp</span>
      </button>
    </div>
  );
}
