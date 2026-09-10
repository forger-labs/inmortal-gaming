"use client";

import { ProductsView } from "@/components/admin/products/ProductsView";
import { RequireRole } from "@/components/RequireRole";

export default function AdminProductsPage() {
  return (
    <RequireRole requiredRole={["SUPER_ADMIN", "ADMIN"]}>
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        <ProductsView />
      </div>
    </RequireRole>
  );
}
