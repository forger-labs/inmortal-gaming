"use client";

import { MotionConfig, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoginForm } from "@/components/login/LoginForm";
import { EASE_OUT_EXPO } from "@/constants";
import { useAuthGuard } from "@/context/AuthGuardContext";

const cardMotion = {
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.05 },
};

const containerMotion = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.25 },
  },
};

const fadeUpMotion = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export default function LoginPage() {
  const { session, sessionReady } = useAuthGuard();
  const router = useRouter();

  // Sesión ya abierta: reenviar al panel.
  useEffect(() => {
    if (sessionReady && session) {
      router.replace("/admin");
    }
  }, [sessionReady, session, router]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary px-4 py-10">
        {/* ─── Fondos: partículas + scanlines ─── */}
        <div aria-hidden="true" className="particle-grid absolute inset-0" />
        <div aria-hidden="true" className="scanlines absolute inset-0" />

        {/* ─── Card de acceso ─── */}
        <motion.section
          aria-labelledby="login-title"
          {...cardMotion}
          className="relative w-full max-w-[420px] rounded-lg border border-neon-primary/30 bg-bg-elevated p-8 shadow-[0_0_60px_-12px_rgba(0,240,255,0.45)] sm:p-10"
        >
          <motion.div
            variants={containerMotion}
            initial="hidden"
            animate="visible"
          >
            {/* ─── Marca ─── */}
            <motion.header
              variants={fadeUpMotion}
              className="flex flex-col gap-2"
            >
              <span
                data-text="INMORTAL GAMING"
                className="glitch w-fit font-display text-2xl font-bold tracking-tight text-neon-primary"
              >
                INMORTAL GAMING
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary">
                Panel de administración
              </p>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-sm border border-neon-amber/30 bg-neon-amber/10 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-neon-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-amber" />
                Acceso restringido
              </span>
            </motion.header>

            {/* ─── Formulario ─── */}

            <LoginForm variants={fadeUpMotion} />

            {/* ─── Pie ─── */}
            <motion.footer
              variants={fadeUpMotion}
              className="mt-7 border-t border-white/5 pt-5"
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-text-secondary">
                SYS_ACCESS :: SOLO OPERADORES AUTORIZADOS
              </p>
            </motion.footer>
          </motion.div>
        </motion.section>
      </main>
    </MotionConfig>
  );
}
