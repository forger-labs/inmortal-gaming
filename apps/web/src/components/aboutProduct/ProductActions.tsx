import { CartIcon, WhatsAppIcon } from "@/components/icons";

export function ProductActions() {
  return (
    <div className="mt-auto space-y-4">
      {/* Initialize Purchase */}
      <button
        type="button"
        className="w-full bg-neon-primary text-bg-primary font-display text-xl font-semibold py-4 rounded flex items-center justify-center gap-2 uppercase tracking-wide transition-all duration-200 hover:scale-[1.02] shadow-[0_0_10px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)]"
      >
        <CartIcon className="h-5 w-5" />
        Initialize Purchase
      </button>

      {/* Connect via WhatsApp */}
      <button
        type="button"
        className="w-full bg-transparent border border-neon-green text-neon-green font-semibold text-[13px] py-4 rounded flex items-center justify-center gap-2 uppercase tracking-widest transition-all duration-200 hover:bg-neon-green/10 shadow-[0_0_8px_rgba(0,255,136,0.1)] hover:shadow-[0_0_12px_rgba(0,255,136,0.3)]"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Connect via WhatsApp
      </button>
    </div>
  );
}
