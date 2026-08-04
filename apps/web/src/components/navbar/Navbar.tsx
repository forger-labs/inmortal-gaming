"use client";

import Link from "next/link";
import { useState } from "react";

import { CartIcon, CloseIcon, MenuIcon } from "@/components/icons";
import type { NavLink } from "@/types";

const NAV_LINKS: NavLink[] = [
  { label: "Catálogo", href: "/catalogo" },
  { label: "Ofertas", href: "#ofertas" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
            aria-label="Carrito"
          >
            <CartIcon className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-neon-primary text-[10px] font-bold text-black">
              3
            </span>
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="btn-neon hidden rounded px-4 py-2 text-xs font-semibold uppercase tracking-wider sm:inline-flex"
          >
            Ingresar
          </Link>

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
        </div>
      )}
    </nav>
  );
}
