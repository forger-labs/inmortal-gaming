import type { Metadata } from "next";
import MyOrdersView from "@/components/orders/MyOrdersView";

export const metadata: Metadata = {
  title: "Mis Pedidos",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyOrders() {
  return <MyOrdersView />;
}
