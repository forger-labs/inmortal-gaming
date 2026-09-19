export interface AdminNavLink {
  label: string;
  href: string;
  icon:
    | "dashboard"
    | "products"
    | "categories"
    | "orders"
    | "analytics"
    | "users"
    | "landing";
}

export type AdminStatTone = "green" | "amber" | "muted";

export interface AdminStatCard {
  label: string;
  value: string;
  icon: "wallet" | "pending" | "users" | "memory";
  helper: {
    text: string;
    tone: AdminStatTone;
  };
}

export interface AdminTransmission {
  id: string;
  client: string;
  status: "Complete" | "Pending" | "Failed";
}

export interface AdminSalesBar {
  day: string;
  value: number;
}

/* ─── Gestión de usuarios del panel ─── */

export type AdminUserRole = "SUPER_ADMIN" | "ADMIN";

export type AdminUserStatus = "active" | "inactive";

export interface AdminEntity {
  id: number;
  name: string;
  lastname: string;
  email: string;
  role: AdminUserRole | string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAdminDTO {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: AdminUserRole | string;
}

export interface UpdateAdminDTO {
  name?: string;
  lastname?: string;
  email?: string;
  password?: string;
  role?: AdminUserRole | string;
}

export interface AdminUser {
  id: number | string;
  name: string;
  lastname: string;
  email: string;
  role: AdminUserRole;
  created_at?: string;
  updated_at?: string;
}

/** Datos editables de un usuario administrador del panel. */
export interface AdminUserFormValues {
  name: string;
  lastname: string;
  email: string;
  password?: string;
  role: AdminUserRole;
}

export interface AdminUserFilters {
  search: string;
  role: AdminUserRole | "all";
}
