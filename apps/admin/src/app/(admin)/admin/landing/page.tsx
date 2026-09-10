"use client";

import { LandingView } from "@/components/admin/landing/LandingView";
import { RequireRole } from "@/components/RequireRole";

export default function AdminLandingPage() {
  return (
    <RequireRole requiredRole={["SUPER_ADMIN", "ADMIN"]}>
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        <LandingView />
      </div>
    </RequireRole>
  );
}
