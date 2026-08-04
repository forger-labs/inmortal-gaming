export interface AdminNavLink {
  label: string;
  href: string;
  icon: "dashboard" | "products" | "orders" | "analytics";
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
