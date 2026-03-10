"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(Number(id));
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  const cancelOrder = async () => {
    if (!confirm("Cancel this order?")) return;

    try {
      await api.cancelOrder(Number(id));
      alert("Order cancelled");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!order) return <div>Loading...</div>;

  return (
    <div className="order-detail">
      <h1>Order #{order.id}</h1>

      <p>Status: {order.status}</p>
      <p>Total: {order.totalAmount}₫</p>

      {order.status === "Pending" && (
        <button onClick={cancelOrder}>Cancel Order</button>
      )}
    </div>
  );
}