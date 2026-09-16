"use client";

import { CartIcon, CloseIcon, MenuIcon, UsersIcon } from "@shared/icons";
import { cyberInfo } from "@shared/toasts";
import Link from "next/link";
import { useState } from "react";

import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Ofertas", href: "#ofertas" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAuthenticated, email, logout } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    await logout();
    cyberInfo("Sesion cerrada correctamente.", "[SESION]");
  };

  return (
    <>
      <nav className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 md:px-12">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="glitch text-2xl font-display font-bold tracking-tight"
            data-text="INMORTAL GAMING"
          >
            INMORTAL GAMING
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-text-secondary transition-colors hover:text-neon-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-text-secondary transition-colors hover:text-neon-primary"
              aria-label={`Carrito (${totalItems} items)`}
            >
              <CartIcon className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-primary px-1 text-[10px] font-bold text-black shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account: login trigger (logged out) or user + logout (logged in) */}
            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/profile"
                  className="flex max-w-[180px] items-center gap-2 rounded border border-border-subtle bg-bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-neon-primary/50 hover:text-neon-primary"
                  title="Ver perfil"
                >
                  <UsersIcon className="h-4 w-4 shrink-0 text-neon-primary" />
                  <span className="truncate">{email}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer rounded border border-neon-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-neon-primary transition-colors hover:bg-neon-primary/10"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className="btn-neon hidden rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider sm:inline-flex"
              >
                Ingresar
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="p-2 text-text-secondary transition-colors hover:text-neon-primary md:hidden"
              aria-label="Menú"
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-border-subtle bg-bg-primary/95 px-6 pb-4 pt-2 backdrop-blur-md md:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm text-text-secondary transition-colors hover:text-neon-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-sm text-text-secondary transition-colors hover:text-neon-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/profile/my-orders"
                  className="block py-2 text-sm text-text-secondary transition-colors hover:text-neon-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Mis Ordenes
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                if (isAuthenticated) handleLogout();
                else setLoginOpen(true);
              }}
              className="block w-full py-2 text-left text-sm text-text-secondary transition-colors hover:text-neon-primary"
            >
              {isAuthenticated ? "Salir" : "Ingresar"}
            </button>
          </div>
        )}
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
