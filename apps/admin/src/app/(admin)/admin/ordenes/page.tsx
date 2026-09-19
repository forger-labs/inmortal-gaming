"use client";

import { OrdersView } from "@/components/admin/orders/OrdersView";
import { RequireRole } from "@/components/RequireRole";

export default function AdminOrdersPage() {
  return (
    <RequireRole requiredRole={["SUPER_ADMIN", "ADMIN"]}>
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        <OrdersView />
      </div>
    </RequireRole>
  );
}
