"use client";

import type { AdminUser } from "@shared/types";

import { TableEmptyState } from "@/components/commonList/TableEmptyState";
import { UsersRow } from "./UsersRow";
import { UsersTableSkeleton } from "./UsersTableSkeleton";

interface UsersTableProps {
  users: AdminUser[];
  loading?: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function UsersTable({
  users,
  loading = false,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-190 border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Apellido
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Correo electronico
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Rol
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <UsersTableSkeleton />
          ) : users.length === 0 ? (
            <TableEmptyState
              colSpan={5}
              title="Sin resultados"
              description="Ningun administrador coincide con los filtros actuales. Prueba con otros terminos o limpia los filtros."
            />
          ) : (
            users.map((user, index) => (
              <UsersRow
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                user={user}
                key={user.id}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
