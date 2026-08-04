import { RECENT_TRANSMISSIONS } from "@/mocks/admin";
import type { AdminTransmission } from "@/types";

const STATUS_STYLES: Record<AdminTransmission["status"], string> = {
  Complete: "bg-neon-green/10 text-neon-green",
  Pending: "bg-neon-amber/10 text-neon-amber",
  Failed: "bg-neon-pink/10 text-neon-pink",
};

export function RecentTransmissions() {
  return (
    <section className="flex h-[304px] flex-col rounded-lg border border-neon-primary/20 bg-[#12141f] p-6">
      <h2 className="font-display text-lg font-semibold text-white">
        Recent Transmissions
      </h2>

      <div className="mt-4 flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#ffffff0a]">
              <th className="pb-3 pr-4 font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
                ID
              </th>
              <th className="pb-3 pr-4 font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Client
              </th>
              <th className="pb-3 font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {RECENT_TRANSMISSIONS.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#ffffff08] last:border-b-0"
              >
                <td className="py-3 pr-4 font-mono text-sm text-neon-primary">
                  {row.id}
                </td>
                <td className="py-3 pr-4 font-body text-sm text-text-secondary">
                  {row.client}
                </td>
                <td className="py-3">
                  <span
                    className={`inline-block rounded-sm px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
