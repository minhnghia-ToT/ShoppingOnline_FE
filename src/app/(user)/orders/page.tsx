"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="order-card"
          onClick={() => router.push(`/orders/${order.id}`)}
        >
          <div>Order #{order.id}</div>
          <div>Status: {order.status}</div>
          <div>Total: {order.totalAmount}₫</div>
        </div>
      ))}

      <style jsx>{`
        .orders-page {
          max-width: 800px;
          margin: auto;
          padding: 60px 20px;
        }

        .order-card {
          border: 1px solid #ddd;
          padding: 20px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}