"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

interface AdminSidebarContextValue {
  mobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | undefined>(
  undefined,
);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <AdminSidebarContext.Provider
      value={{ mobileOpen, toggleMobile, closeMobile }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  }
  return context;
}
