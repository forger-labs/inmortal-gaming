"use client";

import { OrdersIcon, UserIcon } from "@shared/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/constants";

export default function ProfileNavTabs() {
  const pathname = usePathname();
  const isProfileActive =
    pathname === ROUTES.profile || pathname === "/profile";
  const isOrdersActive =
    pathname === ROUTES.myOrders || pathname === "/profile/my-orders";

  return (
    <nav
      aria-label="Navegacion de perfil"
      className="flex items-center gap-2 border-b border-white/10 pb-4"
    >
      <Link
        href={ROUTES.profile}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
          isProfileActive
            ? "border border-neon-primary bg-neon-primary/10 text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            : "border border-white/5 bg-bg-surface/60 text-text-secondary hover:border-white/20 hover:text-text-primary"
        }`}
      >
        <UserIcon className="h-4 w-4" />
        <span>Mi Cuenta</span>
      </Link>

      <Link
        href={ROUTES.myOrders}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm font-semibold uppercase tracking-wider transition-all duration-200 ${
          isOrdersActive
            ? "border border-neon-primary bg-neon-primary/10 text-neon-primary shadow-[0_0_15px_rgba(0,240,255,0.25)]"
            : "border border-white/5 bg-bg-surface/60 text-text-secondary hover:border-white/20 hover:text-text-primary"
        }`}
      >
        <OrdersIcon className="h-4 w-4" />
        <span>Mis Ordenes</span>
      </Link>
    </nav>
  );
}
