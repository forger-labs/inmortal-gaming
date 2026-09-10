"use client";

import type { SubcategoryEntity } from "@shared/types";

import { DeleteModal } from "../commonForm/DeleteModal";

interface DeleteSubcategoryModalProps {
  open: boolean;
  subcategory?: SubcategoryEntity;
  onConfirm: (subcategory: SubcategoryEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteSubcategoryModal({
  open,
  subcategory,
  onConfirm,
  onClose,
}: DeleteSubcategoryModalProps) {
  return (
    <DeleteModal
      open={open && Boolean(subcategory)}
      id="delete-subcategory"
      title="Eliminar subcategoria"
      description={
        <>
          ¿Estas seguro de que deseas eliminar la subcategoria{" "}
          <strong className="text-text-primary">
            {subcategory?.subcategory_name}
          </strong>
          ? Esta accion eliminara permanentemente su definicion de esquema JSON.
        </>
      }
      onConfirm={() => {
        if (subcategory) return onConfirm(subcategory);
      }}
      onClose={onClose}
    />
  );
}
