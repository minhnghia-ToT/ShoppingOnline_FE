"use client";

import { useEffect, useState } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const order = await api.checkout(paymentMethod);

      localStorage.removeItem("cart");

      alert("Order created successfully!");

      router.push("/orders/" + order.id);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* PRODUCTS */}
      <div className="product-box">
        <h3>Your Products</h3>

        {cart.map((item) => (
          <div key={item.id} className="product-row">
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
            <span>{formatPrice(item.price)}</span>
          </div>
        ))}

        <div className="total">
          Total: {formatPrice(total)}
        </div>
      </div>

      {/* PAYMENT */}
      <div className="payment-box">
        <h3>Payment Method</h3>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="COD">Cash On Delivery</option>
          <option value="VNPAY">VNPay</option>
        </select>
      </div>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>

      <style jsx>{`
        .checkout-page {
          max-width: 700px;
          margin: auto;
          padding: 60px 20px;
        }

        .product-box {
          border: 1px solid #eee;
          padding: 20px;
          margin-bottom: 30px;
        }

        .product-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
        }

        .total {
          margin-top: 20px;
          font-weight: bold;
          text-align: right;
        }

        select {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
        }

        button {
          margin-top: 30px;
          width: 100%;
          padding: 14px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}