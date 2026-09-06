"use client";

import { SearchIcon } from "@shared/icons";
import type { AdminUser } from "@shared/types";

import { UsersRow } from "./UsersRow";

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
              Correo electrónico
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
            Array.from({ length: 5 }, (_, i) => (
              <tr
                key={`loading-row-${i + 1}`}
                className="animate-pulse border-b border-white/5"
              >
                <td className="px-6 py-4">
                  <div className="h-4 w-24 rounded bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-28 rounded bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-44 rounded bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-5 w-20 rounded bg-white/10" />
                </td>
                <td className="px-6 py-4">
                  <div className="ml-auto h-7 w-16 rounded bg-white/10" />
                </td>
              </tr>
            ))
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-bg-primary text-text-muted">
                  <SearchIcon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-base font-semibold text-text-primary">
                  Sin resultados
                </p>
                <p className="mx-auto mt-1 max-w-sm font-body text-sm leading-relaxed text-text-secondary">
                  Ningún administrador coincide con los filtros actuales. Prueba
                  con otros términos o limpia los filtros.
                </p>
              </td>
            </tr>
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
