"use client";

import { CategoriesIcon, GridIcon } from "@shared/icons";
import type { ReactNode } from "react";
import { useState } from "react";

import { LandingBannersView } from "./LandingBannersView";
import { LandingSectionsView } from "./LandingSectionsView";

type ActiveLandingTab = "sections" | "banners";

interface LandingTabItem {
  key: ActiveLandingTab;
  label: string;
  icon: ReactNode;
}

const LANDING_TABS: LandingTabItem[] = [
  {
    key: "sections",
    label: "Categorias y Subcategorias",
    icon: <CategoriesIcon className="h-4 w-4" />,
  },
  {
    key: "banners",
    label: "Banners y Destacados",
    icon: <GridIcon className="h-4 w-4" />,
  },
];

const TAB_VIEWS: Record<ActiveLandingTab, ReactNode> = {
  sections: <LandingSectionsView />,
  banners: <LandingBannersView />,
};

export function LandingView() {
  const [activeTab, setActiveTab] = useState<ActiveLandingTab>("sections");

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Selector de Vistas / Pestañas ─── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
        {LANDING_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "border border-neon-primary/40 bg-neon-primary/15 text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "border border-transparent text-text-secondary hover:border-white/10 hover:text-text-primary"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Contenido dinamico de la vista activa ─── */}
      {TAB_VIEWS[activeTab]}
    </div>
  );
}
