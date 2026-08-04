"use client";

import { useState } from "react";

interface Category {
  id: string;
  label: string;
}

interface StatusOption {
  id: string;
  label: string;
  color: "green" | "muted";
}

const CATEGORIES: Category[] = [
  { id: "cyberware", label: "Cyberware (Hardware)" },
  { id: "software", label: "Software (Games)" },
  { id: "apparel", label: "Apparel" },
];

const STATUS_OPTIONS: StatusOption[] = [
  { id: "in-stock", label: "In Stock", color: "green" },
  { id: "pre-order", label: "Pre-order", color: "muted" },
];

export function Filters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "cyberware",
  ]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <aside className="w-full">
      <div className="bg-bg-surface p-6 border-l border-neon-primary/30 rounded-lg">
        {/* Header */}
        <h3 className="font-display text-lg font-semibold text-neon-primary mb-6 border-b border-border-subtle pb-2 uppercase tracking-wide">
          Filters
        </h3>

        {/* Category group */}
        <div className="mb-6">
          <h4 className="font-body text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">
            Category
          </h4>
          <ul className="space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <label className="flex items-center gap-2 cursor-pointer font-body text-sm text-text-secondary hover:text-neon-primary transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="rounded border-border-subtle bg-bg-surface-hover text-neon-primary focus:ring-neon-primary focus:ring-offset-0"
                  />
                  {cat.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Status group */}
        <div>
          <h4 className="font-body text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">
            Status
          </h4>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((status) => (
              <span
                key={status.id}
                className={`cursor-pointer rounded-sm border px-2 py-1 font-mono text-xs transition-colors ${
                  status.color === "green"
                    ? "border-neon-green text-neon-green bg-neon-green/10 hover:bg-neon-green/20"
                    : "border-border-subtle text-text-secondary bg-bg-surface-hover hover:border-neon-primary hover:text-neon-primary"
                }`}
              >
                {status.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
