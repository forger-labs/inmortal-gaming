"use client";

import { SALES_DATA } from "@shared/mocks/admin";

export function SalesVolumeChart() {
  return (
    <section className="rounded-lg border border-neon-primary/20 bg-[#12141f] p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        Sales Volume Stream
      </h2>

      <div className="mt-6 flex items-end justify-between gap-3">
        {SALES_DATA.map((bar) => (
          <div
            key={bar.day}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <span className="font-mono text-[10px] text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
              ¤{bar.value}k
            </span>
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-neon-primary/30 to-neon-primary transition-all duration-300 group-hover:from-neon-primary/50 group-hover:to-neon-primary"
              style={{ height: `${(bar.value / 10) * 160}px` }}
            />
            <span className="font-mono text-[11px] text-text-muted">
              {bar.day}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
