"use client";

import type { CategoryEntity } from "@shared/types";

import { DeleteModal } from "../commonForm/DeleteModal";

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
  return (
    <DeleteModal
      open={open && Boolean(category)}
      id="delete-category"
      title="Eliminar categoria"
      description={
        <>
          ¿Estas seguro de que deseas eliminar la categoria{" "}
          <strong className="text-text-primary">
            {category?.category_name}
          </strong>
          ? Esta accion no se puede deshacer.
        </>
      }
      onConfirm={() => {
        if (category) return onConfirm(category);
      }}
      onClose={onClose}
    />
  );
}
