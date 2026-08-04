"use client";

import { MenuIcon, SearchIcon } from "@/components/icons";
import { useAdminSidebar } from "./AdminSidebarContext";

export function SystemOverviewHeader() {
  const { toggleMobile } = useAdminSidebar();

  return (
    <header className="flex flex-col justify-between gap-4 border-b border-[#ffffff0a] bg-[#0a0b10] px-10 py-4 min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-8">
      <div className="min-w-0">
        {/* ─── Mobile menu toggle ─── */}
        <button
          type="button"
          onClick={toggleMobile}
          aria-label="Open sidebar"
          className="mb-3 p-1 text-neon-primary transition-colors hover:text-white min-[700px]:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* ─── Title + status ─── */}
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white">
          System Overview
        </h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neon-primary">
          DATA_STREAM :: LIVE // SYNC_STATUS: STABLE
        </p>
      </div>

      {/* ─── Search ─── */}
      <div className="relative w-full max-w-xs shrink-0">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
          <SearchIcon className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Query Matrix"
          className="w-full rounded-md border border-[#ffffff0a] bg-[#12141f] py-2.5 pl-9 pr-4 font-mono text-sm text-white placeholder:text-text-muted focus:border-neon-primary focus:outline-none focus:ring-1 focus:ring-neon-primary/30"
        />
      </div>
    </header>
  );
}
