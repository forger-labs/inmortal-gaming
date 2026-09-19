"use client";

import type { ServerEntity } from "@shared/types";

import { DeleteModal } from "../commonForm/DeleteModal";

interface DeleteServerModalProps {
  open: boolean;
  server?: ServerEntity;
  onConfirm: (server: ServerEntity) => Promise<void> | void;
  onClose: () => void;
}

export function DeleteServerModal({
  open,
  server,
  onConfirm,
  onClose,
}: DeleteServerModalProps) {
  return (
    <DeleteModal
      open={open && Boolean(server)}
      id="delete-server"
      title="Eliminar servidor"
      description={
        <>
          ¿Estas seguro de que deseas eliminar el servidor{" "}
          <strong className="text-text-primary">{server?.server_name}</strong>?
          Esta accion no se puede deshacer.
        </>
      }
      onConfirm={() => {
        if (server) return onConfirm(server);
      }}
      onClose={onClose}
    />
  );
}
