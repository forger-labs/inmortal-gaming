import { ChevronDownIcon } from "@/components/icons";

const OFFERS = [
  {
    title: "10% OFF en tu primera compra",
    description:
      "Usa el código BIENVENIDO10 al pagar por WhatsApp. Válido para cualquier producto.",
    code: "BIENVENIDO10",
    color: "neon-primary",
  },
  {
    title: "Combo Game Pass + RP",
    description:
      "Lleva Xbox Game Pass Ultimate + 6.500 RP con un 15% de descuento.",
    code: "COMBO15",
    color: "neon-purple",
  },
  {
    title: "Envío gratis en Gift Cards",
    description:
      "Sin cargos adicionales en todas las Gift Cards de Steam, PlayStation y Xbox.",
    code: null,
    color: "neon-green",
  },
];

function OfferCard({
  title,
  description,
  code,
  color,
}: (typeof OFFERS)[number]) {
  return (
    <article
      className={`relative overflow-hidden rounded-lg cursor-pointer border p-6 transition-all duration-200 hover:-translate-y-1 ${
        color === "neon-primary"
          ? "border-neon-primary/30 bg-neon-primary/[0.04] shadow-[0_0_20px_-8px] shadow-neon-primary"
          : color === "neon-purple"
            ? "border-neon-purple/30 bg-neon-purple/[0.04] shadow-[0_0_20px_-8px] shadow-neon-purple"
            : "border-neon-green/30 bg-neon-green/[0.04] shadow-[0_0_20px_-8px] shadow-neon-green"
      }`}
    >
      {/* Decorative corner line */}
      <div
        className={`absolute -right-6 -top-6 h-12 w-12 rotate-45 ${
          color === "neon-primary"
            ? "bg-neon-primary/10"
            : color === "neon-purple"
              ? "bg-neon-purple/10"
              : "bg-neon-green/10"
        }`}
      />

      <h5 className="mb-2 font-display text-base font-semibold text-text-primary">
        {title}
      </h5>
      <p className="mb-4 font-body text-sm leading-relaxed text-text-secondary">
        {description}
      </p>
      {code && (
        <div className="inline-block rounded border border-dashed border-border-neon bg-bg-elevated/50 px-3 py-1.5 font-mono text-xs tracking-wider text-neon-primary">
          {code}
        </div>
      )}
    </article>
  );
}

export function OffersSection() {
  return (
    <section id="ofertas" className="bg-bg-surface/50">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary">
              Ofertas
            </h2>
            <p className="font-body text-sm text-text-secondary">
              Promociones limitadas para la comunidad gamer
            </p>
          </div>
          <ChevronDownIcon className="hidden h-5 w-5 text-text-muted sm:block -rotate-90" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((offer) => (
            <OfferCard key={offer.title} {...offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
