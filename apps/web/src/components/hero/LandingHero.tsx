import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { ROUTES } from "@/constants";

function riseIn(delay: number): CSSProperties {
  return { "--i": delay } as CSSProperties;
}

export function LandingHero() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      {/* Background image + scrim */}
      <div className="absolute inset-0">
        <Image
          src="/level-up-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-screen"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/85 via-bg-primary/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-transparent to-bg-primary" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-10 md:px-12 md:pt-28 md:pb-11">
        <div className="flex max-w-3xl flex-col items-start gap-6">
          {/* Kicker */}
          <span
            style={riseIn(0)}
            className="rise-in inline-block border border-neon-amber bg-neon-amber/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-neon-amber xs:text-sm"
          >
            🎮 Marketplace Digital
          </span>

          {/* Headline */}
          <h1
            data-text="Bienes Digitales para Gamers"
            style={riseIn(1)}
            className="rise-in glitch font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-neon-primary xs:text-5xl md:text-6xl lg:text-7xl"
          >
            Bienes Digitales para Gamers
          </h1>

          {/* Subheadline */}
          <p
            style={riseIn(3)}
            className="rise-in max-w-lg border-l-2 border-neon-primary/50 pl-4 font-body text-lg text-text-secondary"
          >
            El catálogo más completo de ítems, monedas virtuales, gift cards y
            servicios digitales. Compra seguro, recibe al instante.
          </p>

          {/* CTAs */}
          <div
            style={riseIn(4)}
            className="rise-in flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href={ROUTES.catalog}
              className="btn-neon-primary rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              Explorar Catálogo
            </Link>
            {/*<Link
              href="#ofertas"
              className="btn-neon rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              Ver Ofertas
            </Link>*/}
          </div>
        </div>
      </div>
    </section>
  );
}
