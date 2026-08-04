"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AnalyticsIcon,
  DashboardIcon,
  DownloadIcon,
  OrdersIcon,
  ProductsIcon,
} from "@/components/icons";
import type { AdminNavLink } from "@/types";
import { useAdminSidebar } from "./AdminSidebarContext";

const ADMIN_LINKS: AdminNavLink[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Products", href: "/admin/productos", icon: "products" },
  { label: "Orders", href: "/admin/ordenes", icon: "orders" },
  { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
];

function SidebarIcon({ icon }: { icon: AdminNavLink["icon"] }) {
  const className = "h-5 w-5 shrink-0";

  switch (icon) {
    case "dashboard":
      return <DashboardIcon className={className} />;
    case "products":
      return <ProductsIcon className={className} />;
    case "orders":
      return <OrdersIcon className={className} />;
    case "analytics":
      return <AnalyticsIcon className={className} />;
  }
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobile } = useAdminSidebar();

  return (
    <>
      {/* ─── Mobile overlay ─── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm min-[700px]:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col bg-[#12141f] transition-transform duration-300 ease-out min-[700px]:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ─── Brand / System label ─── */}
        <div className="px-5 pt-8 pb-6">
          <Link
            href="/admin"
            className="font-display text-base font-bold tracking-tight text-neon-primary"
          >
            INMORTAL GAMING
          </Link>
        </div>

        {/* ─── Admin profile ─── */}
        <div className="mx-4 mb-6 flex items-center gap-3 rounded-md border border-[#ffffff0a] bg-[#0a0b10]/50 px-3 py-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neon-primary/30">
            <Image
              src="/admin/admin-avatar.jpg"
              alt="Admin avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-body text-sm font-medium text-white">
              System Admin
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neon-primary">
              Level 99 Operator
            </span>
          </div>
        </div>

        {/* ─── Navigation ─── */}
        <nav className="px-3">
          <ul className="space-y-1">
            {ADMIN_LINKS.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-neon-primary/10 text-white shadow-[inset_3px_0_0_#00f0ff]"
                        : "text-text-secondary hover:bg-[#ffffff08] hover:text-white"
                    }`}
                  >
                    <span
                      className={
                        isActive ? "text-neon-primary" : "text-neon-primary/70"
                      }
                    >
                      <SidebarIcon icon={link.icon} />
                    </span>
                    <span className="font-body">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ─── Generate Report ─── */}
        <div className="mt-auto border-t border-[#ffffff0a] p-4">
          <button
            type="button"
            className="btn-neon-primary flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-mono text-xs font-semibold uppercase tracking-wider"
          >
            <DownloadIcon className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </aside>
    </>
  );
}
