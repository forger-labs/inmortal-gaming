"use client";

import { PlusIcon } from "@shared/icons";
import type {
  AdminEntity,
  AdminUser,
  AdminUserFilters,
  AdminUserFormValues,
} from "@shared/types";
import { useCallback, useEffect, useState } from "react";

import { RequireRole } from "@/components/RequireRole";
import { UsersFilterBar } from "@/components/admin/UsersFilterBar";
import { UsersPagination } from "@/components/admin/UsersPagination";
import { UserFormModal } from "@/components/admin/users/UserFormModal";
import { UsersTable } from "@/components/admin/users/UsersTable";
import {
  cyberError,
  cyberInfo,
  cyberSuccess,
} from "@/components/toasts/cyberToasts";
import { adminApi } from "@/libs/adminApi";

const PAGE_SIZE = 10;

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  user?: AdminUser;
}

const DEFAULT_FILTERS: AdminUserFilters = {
  search: "",
  role: "all",
};

const CLOSED_MODAL: ModalState = { open: false, mode: "create" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminUserFilters>(DEFAULT_FILTERS);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  const loadAdmins = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getAdmins(targetPage, PAGE_SIZE);
      const items = (response.items || []).map((admin: AdminEntity) => ({
        id: admin.id,
        name: admin.name,
        lastname: admin.lastname,
        email: admin.email,
        role:
          admin.role?.toUpperCase() === "SUPERADMIN" ||
          admin.role?.toUpperCase() === "SUPER_ADMIN"
            ? ("SUPER_ADMIN" as const)
            : ("ADMIN" as const),
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      }));

      setUsers(items);
      setTotal(response.total ?? items.length);
      setTotalPages(
        response.total_pages ??
          Math.max(1, Math.ceil((response.total ?? items.length) / PAGE_SIZE)),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la lista de administradores";
      cyberError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins(page);
  }, [loadAdmins, page]);

  const query = filters.search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (
      query &&
      !`${user.name} ${user.lastname} ${user.email}`
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }
    if (filters.role !== "all" && user.role !== filters.role) {
      return false;
    }
    return true;
  });

  const handleFiltersChange = (next: AdminUserFilters) => {
    setFilters(next);
  };

  const handlePageChange = (next: number) => {
    const safePage = Math.min(Math.max(1, next), Math.max(1, totalPages));
    setPage(safePage);
  };

  const handleSubmit = async (values: AdminUserFormValues) => {
    if (!modal.open) return;

    try {
      if (modal.mode === "create") {
        await adminApi.createAdmin({
          name: values.name.trim(),
          lastname: values.lastname.trim(),
          email: values.email.trim(),
          password: values.password || "",
          role: values.role,
        });

        cyberSuccess(
          `Administrador creado. ${values.name} ${values.lastname} se agregó al sistema.`,
        );
      } else if (modal.user) {
        await adminApi.updateAdmin(modal.user.id, {
          name: values.name.trim(),
          lastname: values.lastname.trim(),
          email: values.email.trim(),
          ...(values.password ? { password: values.password } : {}),
          role: values.role,
        });

        cyberSuccess(
          `Administrador actualizado. Se guardaron los cambios de ${values.name} ${values.lastname}.`,
        );
      }

      setModal(CLOSED_MODAL);
      await loadAdmins(page);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar el administrador";
      cyberError(message);
    }
  };

  const handleDeletePlaceholder = (user: AdminUser) => {
    cyberInfo(
      `Eliminar a ${user.name} ${user.lastname} no está disponible (funcionalidad pendiente de integración).`,
    );
  };

  return (

    <RequireRole requiredRole={["SUPER_ADMIN"]}>
      <div className="flex min-h-screen flex-col px-6 py-6 lg:px-8">
        {/* ─── Header ─── */}
        <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-display text-3xl font-semibold text-text-primary">
              Administradores
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
            Crear administrador
          </button>
        </header>

        {/* ─── Panel: filtros + tabla + paginación ─── */}
        <section
          aria-label="Lista de administradores"
          className="overflow-hidden rounded-lg border border-white/5 bg-bg-surface"
        >
          <UsersFilterBar
            filters={filters}
            onChange={handleFiltersChange}
            resultCount={filteredUsers.length}
          />
          <UsersTable
            users={filteredUsers}
            loading={loading}
            onEdit={(user) => setModal({ open: true, mode: "edit", user })}
            onDelete={handleDeletePlaceholder}
          />
          {!loading && total > 0 && (
            <UsersPagination
              page={page}
              pageCount={totalPages}
              total={total}
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
        onSubmit={handleSubmit}
        onClose={() => setModal(CLOSED_MODAL)}
      />
    </RequireRole>
  );
}
