import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-[#0a0b10]">
        <AdminSidebar />
        <main className="w-full min-[700px]:ml-[250px]">{children}</main>
      </div>
    </AdminSidebarProvider>
  );
}
