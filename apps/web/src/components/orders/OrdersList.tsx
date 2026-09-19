import type { OrderEntity } from "@shared/types";

import OrderCard from "./OrderCard";

interface OrdersListProps {
  orders: OrderEntity[];
}

export default function OrdersList({ orders }: OrdersListProps) {
  return (
    <div className="flex flex-col gap-4">
      {orders.map((order, index) => (
        <OrderCard key={order.id} order={order} index={index} />
      ))}
    </div>
  );
}
