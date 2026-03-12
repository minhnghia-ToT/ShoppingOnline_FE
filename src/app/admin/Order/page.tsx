"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";

interface Order {
  id: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert("Update status failed");
    }
  };

  if (loading) return <div style={{ padding: 30 }}>Loading orders...</div>;

  return (
    <div style={{ padding: 30 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        Order Management
      </h1>

      <div
        style={{
          background: "white",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              background: "#f4f6fb",
              fontSize: 13,
              textAlign: "left",
            }}
          >
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Payment</th>
              <th style={th}>Payment Status</th>
              <th style={th}>Created</th>
              <th style={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
                <td style={td}>#{o.id}</td>

                <td style={td}>
                  ${o.totalAmount.toLocaleString()}
                </td>

                <td style={td}>
                  <span
                    style={{
                      background: "#fff3cd",
                      color: "#856404",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {o.status}
                  </span>
                </td>

                <td style={td}>{o.paymentMethod}</td>

                <td style={td}>
                  <span
                    style={{
                      background: "#e8f0fe",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  >
                    {o.paymentStatus}
                  </span>
                </td>

                <td style={td}>
                  {new Date(o.createdAt).toLocaleString()}
                </td>

                <td style={td}>
                  <select
                    defaultValue={o.status}
                    onChange={(e) =>
                      updateStatus(o.id, e.target.value)
                    }
                    style={{
                      padding: "4px 6px",
                      borderRadius: 4,
                    }}
                  >
                    <option>Confirmed</option>
                    <option>Processing</option>
                    <option>Shipping</option>
                    <option>Delivered</option>
                    {/* <option>Cancelled</option> */}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: "12px 16px",
  fontWeight: 600,
  color: "#555",
};

const td: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
};