"use client";

import {
  AnalyticsIcon,
  DashboardIcon,
  LogoutIcon,
  OrdersIcon,
  ProductsIcon,
  UsersIcon,
} from "@shared/icons";
import type { AdminNavLink } from "@shared/types";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cyberInfo } from "@/components/toasts/cyberToasts";
import { ROUTES } from "@/constants/routes";
import { useAuthGuard } from "../../context/AuthGuardContext";
import { useAdminSidebar } from "./AdminSidebarContext";

const ADMIN_LINKS: AdminNavLink[] = [
  { label: "Dashboard", href: ROUTES.admin, icon: "dashboard" },
  { label: "Productos", href: ROUTES.productos, icon: "products" },
  { label: "Pedidos", href: ROUTES.pedidos, icon: "orders" },
  { label: "Analítica", href: ROUTES.analytics, icon: "analytics" },
  { label: "Usuarios", href: ROUTES.usuarios, icon: "users" },
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
    case "users":
      return <UsersIcon className={className} />;
  }
}

function initialsFrom(username: string | undefined): string {
  if (!username) return "OP";
  return username.slice(0, 2).toUpperCase();
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileOpen, closeMobile } = useAdminSidebar();
  const { session, signOut } = useAuthGuard();
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  const visibleLinks = ADMIN_LINKS.filter(
    (link) => link.href !== "/admin/usuarios" || isSuperAdmin,
  );

  const handleSignOut = async () => {
    const operator = session?.username ?? "operador";
    await signOut();
    cyberInfo(`Sesion cerrada. Hasta pronto, @${operator}.`);
    router.replace("/");
  };

  return (
    <>
      {/* ─── Mobile overlay ─── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm min-[700px]:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col bg-bg-surface transition-transform duration-300 ease-out min-[700px]:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ─── Brand / label de sistema ─── */}
        <div className="px-5 pt-8 pb-6">
          <Link
            href="/admin"
            onClick={closeMobile}
            className="font-display text-base font-bold tracking-tight text-neon-primary"
          >
            INMORTAL GAMING
          </Link>
        </div>

        {/* ─── Perfil del operador ─── */}
        <div className="mx-4 mb-6 flex items-center gap-3 rounded-md border border-white/5 bg-bg-primary/50 px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neon-primary/30 bg-bg-elevated font-mono text-xs font-bold text-neon-primary">
            {initialsFrom(session?.username)}
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="truncate font-body text-sm font-medium text-text-primary">
              {session?.username ?? "Operador"}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-neon-primary">
              {session?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </span>
          </div>
        </div>

        {/* ─── Navegación ─── */}
        <nav className="px-3">
          <ul className="space-y-1">
            {visibleLinks.map((link) => {
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
                        : "text-text-secondary hover:bg-white/[0.03] hover:text-white"
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

        {/* ─── Cerrar sesión ─── */}
        <div className="mt-auto border-t border-white/5 p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-white/10 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-text-secondary transition-colors hover:border-neon-pink/40 hover:text-neon-pink cursor-pointer"
          >
            <LogoutIcon className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
