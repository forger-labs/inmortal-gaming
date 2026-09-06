"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { ButtonSidebar } from "@/components/admin/ButtonSidebar";
import { useAuthGuard } from "@/context/AuthGuardContext";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionReady, session } = useAuthGuard();
  const router = useRouter();

  useEffect(() => {
    if (sessionReady && !session) {
      router.replace("/");
    }
  }, [sessionReady, session, router]);

  if (!sessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          Cargando sesión…
        </span>
      </div>
    );
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-bg-primary">
        <AdminSidebar />
        <main className="w-full min-[700px]:ml-[250px]">
          <ButtonSidebar />
          {children}
        </main>
      </div>
    </AdminSidebarProvider>
  );
}
