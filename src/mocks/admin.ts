import type { AdminSalesBar, AdminStatCard, AdminTransmission } from "@/types";

export const ADMIN_STAT_DATA: AdminStatCard[] = [
  {
    label: "Gross Income",
    value: "¤45,298",
    icon: "wallet",
    helper: { text: "+12.3% vs last cycle", tone: "green" },
  },
  {
    label: "Pending Orders",
    value: "142",
    icon: "pending",
    helper: { text: "Requires Attention", tone: "amber" },
  },
  {
    label: "Active Users",
    value: "8,901",
    icon: "users",
    helper: { text: "Steady state", tone: "muted" },
  },
  {
    label: "System Load",
    value: "42%",
    icon: "memory",
    helper: { text: "Optimal", tone: "green" },
  },
];

export const SALES_DATA: AdminSalesBar[] = [
  { day: "Mon", value: 4.2 },
  { day: "Tue", value: 6.5 },
  { day: "Wed", value: 3.0 },
  { day: "Thu", value: 8.0 },
  { day: "Fri", value: 5.0 },
  { day: "Sat", value: 9.5 },
  { day: "Sun", value: 7.0 },
];

export const RECENT_TRANSMISSIONS: AdminTransmission[] = [
  { id: "#0x8A2", client: "Neo_Runner", status: "Complete" },
  { id: "#0x8A3", client: "V_Merc", status: "Pending" },
  { id: "#0x8A4", client: "Silver_H", status: "Complete" },
  { id: "#0x8A5", client: "Lucy_Net", status: "Failed" },
  { id: "#0x8A6", client: "David_M", status: "Pending" },
];
