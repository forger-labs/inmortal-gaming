export function ProductInfo() {
  return (
    <div className="flex flex-col pt-8 md:pt-0">
      {/* Title */}
      <h1 className="font-display text-[32px]/tight md:text-[32px] font-semibold text-text-primary mb-2 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        CyberDeck Pro V9
      </h1>

      {/* Subtitle */}
      <p className="font-mono text-sm text-neon-primary mb-6 opacity-80">
        ID: NX-8923-DELTA // SYS: OPERATIONAL
      </p>

      {/* Price + original price */}
      <div className="flex items-end gap-4 mb-8 pb-6 border-b border-white/10 relative">
        <span className="font-display text-5xl md:text-6xl font-bold text-neon-primary drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
          $299.00
        </span>
        <span className="font-mono text-sm text-text-muted line-through pb-2">
          $350.00
        </span>
        {/* Cyan glow line at bottom */}
        <div className="absolute bottom-0 left-0 w-1/4 h-[1px] bg-neon-primary shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
      </div>
    </div>
  );
}
