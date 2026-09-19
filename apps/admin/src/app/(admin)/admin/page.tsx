import { RecentTransmissions } from "@/components/admin/RecentTransmissions";
import { SalesVolumeChart } from "@/components/admin/SalesVolumeChart";
import { StatsCards } from "@/components/admin/StatsCards";
import { SystemOverviewHeader } from "@/components/admin/SystemOverviewHeader";

export default function AdminDashboardPage() {
  return (
    <div>
      <SystemOverviewHeader />
      <StatsCards />
      <div className="grid grid-cols-1 gap-6 px-8 xl:grid-cols-2">
        <SalesVolumeChart />
        <RecentTransmissions />
      </div>
    </div>
  );
}
