"use client";

import { CloseIcon, DeleteIcon } from "@shared/icons";
import type { CategoryEntity } from "@shared/types";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { EASE_OUT_EXPO } from "@/constants";
import { CancelButton } from "../commonForm/CancelButton";
import { DangerButton } from "../commonForm/DangerButton";

interface DeleteCategoryModalProps {
  open: boolean;
  category?: CategoryEntity;
  onConfirm: (category: CategoryEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteCategoryModal({
  open,
  category,
  onConfirm,
  onClose,
}: DeleteCategoryModalProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const handleConfirm = async () => {
    if (!category) return;
    setSubmitting(true);
    try {
      await onConfirm(category);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && category && (
          <motion.div
            key="delete-category-backdrop"
            className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {open && category && (
          <motion.div
            key="delete-category-dialog"
            className="fixed inset-0 z-[61] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-category-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              className="relative w-full max-w-[440px] rounded-xl border border-neon-pink/30 bg-bg-elevated shadow-[0_0_50px_-12px_rgba(255,45,123,0.35)]"
            >
              {/* ─── Header ─── */}
              <header className="flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-neon-pink/30 bg-neon-pink/10 text-neon-pink">
                    <DeleteIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2
                      id="delete-category-title"
                      className="font-display text-lg font-semibold text-text-primary"
                    >
                      Eliminar categoria
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-neon-pink">
                      Accion destructiva
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar modal"
                  className="rounded-md p-2 text-text-secondary transition-colors hover:text-neon-pink cursor-pointer"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </header>

              {/* ─── Content ─── */}
              <div className="px-6 py-5">
                <p className="font-body text-sm leading-relaxed text-text-secondary">
                  ¿Estas seguro de que deseas eliminar la categoria{" "}
                  <strong className="text-text-primary">
                    {category.category_name}
                  </strong>
                  ? Esta accion no se puede deshacer.
                </p>
              </div>

              {/* ─── Footer ─── */}
              <div className="flex flex-col-reverse gap-2 border-t border-white/5 px-6 py-4 sm:flex-row sm:justify-end">
                <CancelButton onClick={onClose} />
                <DangerButton onClick={handleConfirm} submitting={submitting} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
