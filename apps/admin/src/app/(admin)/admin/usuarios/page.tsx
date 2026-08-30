"use client";

import { PlusIcon } from "@shared/icons";
import { ADMIN_USERS } from "@shared/mocks";
import type {
  AdminUser,
  AdminUserFilters,
  AdminUserFormValues,
} from "@shared/types";
import { useState } from "react";
import { sileo } from "sileo";

import { RequireRole } from "@/components/admin/RequireRole";
import { UsersFilterBar } from "@/components/admin/UsersFilterBar";
import { UsersPagination } from "@/components/admin/UsersPagination";
import { UserFormModal } from "@/components/admin/users/UserFormModal";
import { UsersTable } from "@/components/admin/users/UsersTable";

const PAGE_SIZE = 8;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  user?: AdminUser;
}

const DEFAULT_FILTERS: AdminUserFilters = {
  search: "",
  role: "all",
  status: "all",
};

const CLOSED_MODAL: ModalState = { open: false, mode: "create" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [filters, setFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  const query = filters.search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (
      query &&
      !`${user.name} ${user.lastname} ${user.username}`
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }
    if (filters.role !== "all" && user.role !== filters.role) return false;
    if (filters.status !== "all" && user.status !== filters.status) {
      return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleFiltersChange = (next: AdminUserFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), pageCount));
  };

  const handleSubmit = (values: AdminUserFormValues) => {
    if (!modal.open) return;

    if (modal.mode === "create") {
      setUsers((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          username: values.username.trim(),
          name: values.name.trim(),
          lastname: values.lastname.trim(),
          role: values.role,
          status: values.status,
        },
      ]);
      sileo.success({
        title: "Usuario creado",
        description: `@${values.username.trim()} se agregó al sistema.`,
        position: "top-center",
      });
    } else if (modal.user) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === modal.user?.id
            ? {
                ...user,
                username: values.username.trim(),
                name: values.name.trim(),
                lastname: values.lastname.trim(),
                role: values.role,
                status: values.status,
              }
            : user,
        ),
      );
      sileo.success({
        title: "Usuario actualizado",
        description: `Se guardaron los cambios de @${values.username.trim()}.`,
        position: "top-center",
      });
    }

    setModal(CLOSED_MODAL);
  };

  const handleToggleStatus = (user: AdminUser) => {
    const activating = user.status === "inactive";

    // Doble permiso: el toast de acción exige confirmación explícita.
    const toastId = sileo.action({
      title: activating ? "Activar usuario" : "Desactivar usuario",
      description: activating
        ? `¿Reactivar a ${user.name} ${user.lastname} (@${user.username})? Restablece su acceso al panel.`
        : `¿Desactivar a ${user.name} ${user.lastname} (@${user.username})? Esta acción revoca su acceso al panel.`,
      button: {
        title: "Confirmar",
        onClick: () => {
          sileo.dismiss(toastId);
          setUsers((prev) =>
            prev.map((item) =>
              item.id === user.id
                ? { ...item, status: activating ? "active" : "inactive" }
                : item,
            ),
          );
          sileo.success({
            title: activating ? "Usuario activado" : "Usuario desactivado",
            description: activating
              ? `@${user.username} puede acceder al panel.`
              : `@${user.username} ya no puede acceder al panel.`,
            position: "top-center",
          });
        },
      },
      position: "top-center",
      duration: null,
    });
  };

  return (
    <RequireRole requiredRole="SUPER_ADMIN">
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        {/* ─── Header ─── */}
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold text-text-primary">
              Usuarios
            </h1>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-neon-primary">
              Gestión del sistema :: rol requerido: super_admin
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModal({ open: true, mode: "create" })}
            className="btn-neon-primary flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-bg-primary cursor-pointer"
          >
            <PlusIcon className="h-4 w-4" />
            Crear usuario
          </button>
        </header>

        {/* ─── Panel: filtros + tabla + paginación ─── */}
        <section
          aria-label="Lista de usuarios"
          className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
        >
          <UsersFilterBar
            filters={filters}
            onChange={handleFiltersChange}
            resultCount={filteredUsers.length}
          />
          <UsersTable
            users={pageUsers}
            onEdit={(user) => setModal({ open: true, mode: "edit", user })}
            onToggleStatus={handleToggleStatus}
          />
          {filteredUsers.length > 0 && (
            <UsersPagination
              page={safePage}
              pageCount={pageCount}
              total={filteredUsers.length}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
            />
          )}
        </section>
      </div>

      {/* ─── Modal reutilizable crear / editar ─── */}
      <UserFormModal
        open={modal.open}
        mode={modal.mode}
        user={modal.user}
        existingUsernames={users.map((user) => user.username)}
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />
    </RequireRole>
  );
}
