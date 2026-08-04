import {
  MemoryIcon,
  PendingActionsIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";
import { ADMIN_STAT_DATA } from "@/mocks/admin";
import type { AdminStatCard, AdminStatTone } from "@/types";

function CardIcon({ icon }: { icon: AdminStatCard["icon"] }) {
  const className = "h-6 w-6 text-neon-primary";

  switch (icon) {
    case "wallet":
      return <WalletIcon className={className} />;
    case "pending":
      return <PendingActionsIcon className={className} />;
    case "users":
      return <UsersIcon className={className} />;
    case "memory":
      return <MemoryIcon className={className} />;
  }
}

function HelperText({ tone, text }: { tone: AdminStatTone; text: string }) {
  const toneClasses = {
    green: "text-neon-green",
    amber: "text-neon-amber",
    muted: "text-text-muted",
  };

  return <span className={toneClasses[tone]}>{text}</span>;
}

export function StatsCards() {
  return (
    <section className="grid grid-cols-1 gap-4 p-8 sm:grid-cols-2 xl:grid-cols-4">
      {ADMIN_STAT_DATA.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col justify-between rounded-lg border border-neon-primary/20 bg-[#12141f] p-5"
        >
          <div className="flex items-center justify-between">
            <span className="font-body text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {stat.label}
            </span>
            <CardIcon icon={stat.icon} />
          </div>

          <div className="mt-4">
            <p className="font-display text-2xl font-semibold text-white">
              {stat.value}
            </p>
            <p className="mt-1 font-mono text-xs">
              <HelperText tone={stat.helper.tone} text={stat.helper.text} />
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
