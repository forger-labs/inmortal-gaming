"use client";

import type { LandingItemEntity } from "@shared/types";

import { DeleteModal } from "../commonForm/DeleteModal";

interface DeleteLandingModalProps {
  open: boolean;
  item?: LandingItemEntity;
  onConfirm: (item: LandingItemEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteLandingModal({
  open,
  item,
  onConfirm,
  onClose,
}: DeleteLandingModalProps) {
  return (
    <DeleteModal
      open={open && Boolean(item)}
      id="delete-landing-item"
      title="Eliminar elemento de landing"
      description={
        <>
          ¿Estas seguro de que deseas eliminar la seccion de landing{" "}
          <strong className="text-text-primary">{item?.title}</strong>? Esta
          accion removera el elemento de la pagina principal sin eliminar la
          categoria o subcategoria asociada.
        </>
      }
      onConfirm={() => {
        if (item) return onConfirm(item);
      }}
      onClose={onClose}
    />
  );
}
