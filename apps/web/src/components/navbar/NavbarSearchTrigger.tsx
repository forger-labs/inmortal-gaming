"use client";

import { SearchIcon } from "@shared/icons";
import { useEffect, useState } from "react";

interface NavbarSearchTriggerProps {
  onClick: () => void;
  className?: string;
}

export function NavbarSearchTrigger({
  onClick,
  className = "",
}: NavbarSearchTriggerProps) {
  const [shortcutKey, setShortcutKey] = useState("⌘K");

  useEffect(() => {
    // Detect operating system for shortcut display (Ctrl+K on Windows/Linux, ⌘K on Mac)
    if (typeof window !== "undefined") {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent);
      setShortcutKey(isMac ? "⌘K" : "Ctrl K");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Cmd+K or Ctrl+K to open search anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar productos y subproductos"
      className={`group flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-bg-surface/80 px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-neon-primary/50 hover:bg-bg-surface hover:text-text-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] cursor-pointer ${className}`}
    >
      <div className="flex items-center gap-2">
        <SearchIcon className="h-4 w-4 text-neon-primary transition-transform duration-200 group-hover:scale-110" />
        <span className="font-body text-xs text-text-muted transition-colors group-hover:text-text-secondary hidden sm:inline">
          Buscar
        </span>
        <span className="font-body text-xs text-text-muted transition-colors group-hover:text-text-secondary sm:hidden">
          Buscar...
        </span>
      </div>

      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-bg-primary/90 px-1.5 py-0.5 font-mono text-[10px] text-text-muted transition-colors group-hover:border-neon-primary/40 group-hover:text-neon-primary">
        {shortcutKey}
      </kbd>
    </button>
  );
}
