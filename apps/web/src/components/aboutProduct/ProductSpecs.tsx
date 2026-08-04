import { BoltIcon, MemoryIcon, ShieldCheckIcon } from "@/components/icons";

const SPECS = [
  {
    icon: <MemoryIcon className="h-5 w-5 text-neon-primary shrink-0" />,
    label: "Neural Processing Unit v4.2",
  },
  {
    icon: <BoltIcon className="h-5 w-5 text-neon-primary shrink-0" />,
    label: "Overclocked to 12.5 THz",
  },
  {
    icon: <ShieldCheckIcon className="h-5 w-5 text-neon-primary shrink-0" />,
    label: "Quantum Encryption Standard",
  },
];

export function ProductSpecs() {
  return (
    <div>
      {/* Specs list */}
      <div className="mb-8">
        <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
          Specifications
        </h3>
        <ul className="font-body text-base text-text-secondary space-y-2">
          {SPECS.map((spec) => (
            <li key={spec.label} className="flex items-center gap-3">
              {spec.icon}
              <span>{spec.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Configuration Code input */}
      <div className="mb-8">
        <label
          htmlFor="config-code"
          className="block font-semibold text-[13px] text-text-muted mb-2 uppercase"
        >
          Input Configuration Code
        </label>
        <input
          id="config-code"
          type="text"
          placeholder="ENTER CODE..."
          className="w-full bg-surface-hover border border-white/10 text-text-primary font-mono text-sm px-4 py-3 rounded focus:outline-none focus:border-neon-primary focus:ring-1 focus:ring-neon-primary transition-all placeholder:text-text-muted"
        />
      </div>
    </div>
  );
}
