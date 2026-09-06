"use client";

import { CategoriesIcon } from "@shared/icons";
import type { ReactNode } from "react";
import { useState } from "react";

import { CategoriesView } from "@/components/admin/categories/CategoriesView";
import { SubcategoriesView } from "@/components/admin/subcategories/SubcategoriesView";
import { RequireRole } from "@/components/RequireRole";

type ActiveTab = "categories" | "subcategories";

interface TabItem {
  key: ActiveTab;
  label: string;
  icon: ReactNode;
}

const TAB_BUTTONS: TabItem[] = [
  {
    key: "categories",
    label: "Categorias",
    icon: <CategoriesIcon className="h-4 w-4" />,
  },
  {
    key: "subcategories",
    label: "Subcategorias",
    icon: <CategoriesIcon className="h-4 w-4" />,
  },
];

const TAB_VIEWS: Record<ActiveTab, ReactNode> = {
  categories: <CategoriesView />,
  subcategories: <SubcategoriesView />,
};

export default function AdminCategoriesPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("categories");

  return (
    <RequireRole requiredRole={["SUPER_ADMIN", "ADMIN"]}>
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        {/* ─── Selector de pestañas ─── */}
        <div className="mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
          {TAB_BUTTONS.map((tab) => {
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

        {/* ─── Contenido dinámico mediante diccionario de vistas ─── */}
        {TAB_VIEWS[activeTab]}
      </div>
    </RequireRole>
  );
}
