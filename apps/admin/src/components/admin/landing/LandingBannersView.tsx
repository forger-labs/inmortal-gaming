"use client";

import { LandingIcon, PlusIcon } from "@shared/icons";

import { ListHeader } from "@/components/commonList/ListHeader";

export function LandingBannersView() {
  return (
    <>
      <ListHeader
        title="Banners y Promociones"
        subtitle="Gestion de banners rotativos y anuncios principales de la landing"
        actionLabel="Nuevo banner"
        actionIcon={<PlusIcon className="h-4 w-4" />}
        onAction={() => {}}
      />
      <section className="flex flex-col rounded-xl border border-white/10 bg-bg-surface shadow-2xl">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neon-primary/30 bg-neon-primary/10 text-neon-primary shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <LandingIcon className="h-8 w-8" />
          </span>

          <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
            Modulo de Banners en preparacion
          </h3>

          <p className="mt-2 max-w-md font-body text-sm text-text-secondary">
            Esta vista permitira configurar anuncios destacados, ofertas por
            tiempo limitado y diapositivas principales de la portada.
          </p>

          <span className="mt-4 inline-flex items-center rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-neon-purple">
            Proximamente
          </span>
        </div>
      </section>
    </>
  );
}
