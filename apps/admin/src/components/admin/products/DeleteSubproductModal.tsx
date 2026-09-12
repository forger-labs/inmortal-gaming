"use client";

import type { SubProductEntity } from "@shared/types";

import { DeleteModal } from "@/components/admin/commonForm/DeleteModal";

interface DeleteSubproductModalProps {
  open: boolean;
  subproduct?: SubProductEntity;
  onConfirm: (subproduct: SubProductEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteSubproductModal({
  open,
  subproduct,
  onConfirm,
  onClose,
}: DeleteSubproductModalProps) {
  return (
    <DeleteModal
      open={open && Boolean(subproduct)}
      id="delete-subproduct"
      title="Eliminar subproducto"
      description={
        <>
          ¿Estas seguro de que deseas eliminar el subproducto{" "}
          <strong className="text-text-primary">{subproduct?.name}</strong>?
          Esta accion eliminara permanentemente sus datos e imagen asociada.
        </>
      }
      onConfirm={() => {
        if (subproduct) return onConfirm(subproduct);
      }}
      onClose={onClose}
    />
  );
}
