"use client";

import {
  SearchIcon,
} from "@shared/icons";
import type { AdminUser } from "@shared/types";

import { UsersRow } from "./UsersRow";

interface UsersTableProps {
  users: AdminUser[];
  onEdit: (user: AdminUser) => void;
  onToggleStatus: (user: AdminUser) => void;
}

export function UsersTable({ users, onEdit, onToggleStatus }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-190 border-collapse text-left">
        <thead>
          <tr className="border-b border-neon-primary/20 bg-bg-primary">
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Usuario
            </th>
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
              Rol
            </th>
            <th
              scope="col"
              className="px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
            >
              Estado
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
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-bg-primary text-text-muted">
                  <SearchIcon className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-base font-semibold text-text-primary">
                  Sin resultados
                </p>
                <p className="mx-auto mt-1 max-w-sm font-body text-sm leading-relaxed text-text-secondary">
                  Ningún usuario coincide con los filtros actuales. Prueba con
                  otros términos o limpia los filtros.
                </p>
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <UsersRow
                index={index}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
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
