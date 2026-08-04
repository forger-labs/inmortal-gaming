export function CatalogToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-l border-neon-primary/20 bg-bg-surface p-4">
      {/* Record count */}
      <span className="font-mono text-sm text-text-secondary">
        Displaying 12 records
      </span>

      {/* Sort */}
      <div className="flex items-center gap-3">
        <label className="font-body text-xs font-semibold uppercase text-text-muted">
          Sort by:
        </label>
        <select className="rounded border border-border-subtle bg-bg-surface-hover px-3 py-1.5 font-body text-sm text-text-secondary outline-none transition-colors focus:border-neon-primary focus:ring-1 focus:ring-neon-primary">
          <option>Most Relevant</option>
          <option>Price: High to Low</option>
          <option>Price: Low to High</option>
        </select>
      </div>
    </div>
  );
}
