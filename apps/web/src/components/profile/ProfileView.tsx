"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import ProfileForm from "./ProfileForm";
import ProfileNavTabs from "./ProfileNavTabs";
import ProfileSkeleton from "./ProfileSkeleton";
import ProfileSummaryCard from "./ProfileSummaryCard";
import ProfileUnauthenticated from "./ProfileUnauthenticated";

export default function ProfileView() {
  const { user, isAuthenticated, accessToken, getMe } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchUserData = async () => {
      if (accessToken && !user) {
        await getMe();
      }
      if (mounted) {
        setLoading(false);
      }
    };

    void fetchUserData();

    return () => {
      mounted = false;
    };
  }, [accessToken, user, getMe]);

  if (loading) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-16 md:px-12">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-16 md:px-12">
        <ProfileUnauthenticated
          title="Centro de Control de Usuario"
          description="Inicia sesion para visualizar tu informacion personal, editar tus datos y revisar el historial de tus pedidos."
        />
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      className="mx-auto min-h-screen max-w-7xl px-6 pt-28 pb-16 md:px-12"
    >
      {/* Encabezado */}
      <div className="flex flex-col gap-6">
        <div>
          <span
            data-text="CENTRO DE CONTROL"
            className="glitch font-mono text-xs font-bold uppercase tracking-[0.25em] text-neon-primary"
          >
            Centro de control
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-text-primary sm:text-4xl">
            Perfil de Usuario
          </h1>
          <p className="mt-2 max-w-2xl font-body text-sm text-text-secondary">
            Administra los detalles de tu cuenta, informacion de contacto y
            credenciales.
          </p>
        </div>

        {/* Pestanas de navegacion */}
        <ProfileNavTabs />

        {/* Contenido principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ProfileSummaryCard user={user} />
          </div>
          <div className="lg:col-span-2">
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </motion.main>
  );
}
