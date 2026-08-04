import Image from "next/image";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-bg-surface border-l border-neon-primary/31 mb-12 md:mb-18">
      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0">
        <Image
          src="/level-up-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40 mix-blend-screen"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 p-8 md:p-16 max-w-2xl flex flex-col items-start gap-4">
        {/* Kicker */}
        <span className="inline-block px-3 py-1 border border-neon-amber text-neon-amber font-mono text-[10px] xs:text-sm uppercase tracking-widest bg-neon-amber/10 rounded-sm">
          🎮 MARKETPLACE DIGITAL
        </span>

        {/* Headline */}
        <h1
          data-text="Bienes Digitales para Gamers"
          className="glitch font-display font-bold text-2xl xs:text-4xl md:text-6xl lg:text-7xl text-neon-primary uppercase leading-[1.1]"
        >
          Bienes Digitales para Gamers
        </h1>

        {/* Subheadline */}
        <p className="font-body text-lg text-text-secondary max-w-lg border-l-2 border-neon-primary/50 pl-4">
          El catálogo más completo de ítems, monedas virtuales, gift cards y
          servicios digitales. Compra seguro, recibe al instante.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="catalogo"
            className="btn-neon-primary rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider"
          >
            Explorar Catálogo
          </Link>
          <a
            href="#ofertas"
            className="btn-neon rounded px-8 py-3 text-sm font-semibold uppercase tracking-wider"
          >
            Ver Ofertas
          </a>
        </div>
      </div>
    </section>
  );
}
