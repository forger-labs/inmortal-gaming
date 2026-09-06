import type {
  AdminSalesBar,
  AdminStatCard,
  AdminTransmission,
  AdminUser,
} from "../types";

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

/** Operadores del panel. */
export const ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    email: "j.hernandez@inmortal.com",
    name: "Jorge",
    lastname: "Hernández",
    role: "SUPER_ADMIN",
  },
  {
    id: 2,
    email: "k.ramirez@inmortal.com",
    name: "Karla",
    lastname: "Ramírez",
    role: "SUPER_ADMIN",
  },
  {
    id: 3,
    email: "m.gonzalez@inmortal.com",
    name: "María",
    lastname: "González",
    role: "ADMIN",
  },
  {
    id: 4,
    email: "l.fernandez@inmortal.com",
    name: "Luis",
    lastname: "Fernández",
    role: "ADMIN",
  },
  {
    id: 5,
    email: "a.martinez@inmortal.com",
    name: "Ana",
    lastname: "Martínez",
    role: "ADMIN",
  },
  {
    id: 6,
    email: "c.lopez@inmortal.com",
    name: "Carlos",
    lastname: "López",
    role: "ADMIN",
  },
  {
    id: 7,
    email: "d.torres@inmortal.com",
    name: "Daniela",
    lastname: "Torres",
    role: "ADMIN",
  },
  {
    id: 8,
    email: "e.castillo@inmortal.com",
    name: "Eduardo",
    lastname: "Castillo",
    role: "ADMIN",
  },
  {
    id: 9,
    email: "f.rojas@inmortal.com",
    name: "Fernanda",
    lastname: "Rojas",
    role: "ADMIN",
  },
  {
    id: 10,
    email: "g.mendoza@inmortal.com",
    name: "Gabriel",
    lastname: "Mendoza",
    role: "ADMIN",
  },
];
