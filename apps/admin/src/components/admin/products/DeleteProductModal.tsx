"use client";

import type { ProductEntity } from "@shared/types";

import { DeleteModal } from "../commonForm/DeleteModal";

interface DeleteProductModalProps {
  open: boolean;
  product?: ProductEntity;
  onConfirm: (product: ProductEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteProductModal({
  open,
  product,
  onConfirm,
  onClose,
}: DeleteProductModalProps) {
  return (
    <DeleteModal
      open={open && Boolean(product)}
      id="delete-product"
      title="Eliminar producto"
      description={
        <>
          ¿Estas seguro de que deseas eliminar el producto{" "}
          <strong className="text-text-primary">{product?.name}</strong>? Esta
          accion no se puede deshacer.
        </>
      }
      onConfirm={() => {
        if (product) return onConfirm(product);
      }}
      onClose={onClose}
    />
  );
}
