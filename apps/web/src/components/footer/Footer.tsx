import Link from "next/link";

import { WhatsAppIcon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="border-t border-text-muted/20 bg-bg-primary/95 px-6 py-12 backdrop-blur-sm md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* WhatsApp CTA */}
        <div className="mb-12 flex flex-col items-center gap-4 rounded-lg border border-neon-green/30 bg-neon-green/[0.03] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="mb-1 font-display text-base font-semibold text-text-primary">
              ¿Listo para tu próxima compra?
            </p>
            <p className="font-body text-sm text-text-secondary">
              Contáctanos por WhatsApp y recibe atención personalizada al
              instante
            </p>
          </div>
          <Link
            href="https://wa.me/584161234567"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded bg-neon-green px-6 py-3 font-body text-sm font-semibold text-black transition-all duration-200 hover:bg-neon-green/90 hover:shadow-[0_0_20px] hover:shadow-neon-green/50"
          >
            <WhatsAppIcon className="h-5 w-5" title="WhatsApp" />
            Escribir por WhatsApp
          </Link>
        </div>

        {/* Grid */}
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <span
              className="glitch inline-block text-lg font-display font-bold tracking-tight"
              data-text="INMORTAL"
            >
              INMORTAL
            </span>
            <p className="mt-3 font-body text-xs leading-relaxed text-text-muted">
              El marketplace definitivo para la era digital. Items exclusivos,
              entrega rápida y seguridad garantizada en cada transacción.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Productos
            </h4>
            <ul className="space-y-2">
              {[
                "Items de Juego",
                "Moneda Virtual",
                "Gift Cards",
                "Servicios",
              ].map((label) => (
                <li key={label}>
                  <a
                    href="#category"
                    className="font-body text-xs text-text-muted transition-colors hover:text-neon-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Soporte
            </h4>
            <ul className="space-y-2">
              {["WhatsApp", "FAQ", "Términos", "Privacidad"].map((label) => (
                <li key={label}>
                  <a
                    href="#item"
                    className="font-body text-xs text-text-muted transition-colors hover:text-neon-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-text-secondary">
              Comunidad
            </h4>
            <ul className="space-y-2">
              {["Discord", "Instagram", "Twitter", "TikTok"].map((label) => (
                <li key={label}>
                  <a
                    href="#network"
                    className="font-body text-xs text-text-muted transition-colors hover:text-neon-primary"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-text-muted/20 pt-6 text-center">
          <p className="font-body text-[11px] text-text-muted">
            &copy; {new Date().getFullYear()} Inmortal Gaming. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
