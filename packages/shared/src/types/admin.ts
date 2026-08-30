export interface AdminNavLink {
  label: string;
  href: string;
  icon: "dashboard" | "products" | "orders" | "analytics" | "users";
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

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  lastname: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

/** Datos editables de un usuario del panel. La contraseña nunca viaja en la
 * lista; solo se crea o actualiza desde el formulario. */
export interface AdminUserFormValues {
  username: string;
  password: string;
  name: string;
  lastname: string;
  role: AdminUserRole;
  status: AdminUserStatus;
}

export interface AdminUserFilters {
  search: string;
  role: AdminUserRole | "all";
  status: AdminUserStatus | "all";
}
