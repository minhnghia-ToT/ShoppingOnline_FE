"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}${path}`;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(data);
  }, []);

  const updateQuantity = (id: number, quantity: number) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={getImageUrl(item.image)} />

          <div className="cart-info">
            <h3>{item.name}</h3>
            <p>{formatPrice(item.price)}</p>

            <div className="qty">
              <button
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                onClick={() =>
                  updateQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <button
              className="remove"
              onClick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-summary">
          <h3>Total: {formatPrice(total)}</h3>

          <button onClick={() => router.push("/checkout")}>
            Checkout
          </button>
        </div>
      )}

      <style jsx>{`
        .cart-page {
          max-width: 900px;
          margin: auto;
          padding: 60px 20px;
        }

        .cart-item {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid #eee;
          padding: 20px 0;
        }

        .cart-item img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }

        .qty {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .qty button {
          width: 30px;
          height: 30px;
        }

        .remove {
          margin-top: 10px;
          background: none;
          border: none;
          color: red;
          cursor: pointer;
        }

        .cart-summary {
          margin-top: 30px;
          text-align: right;
        }

        .cart-summary button {
          margin-top: 10px;
          padding: 12px 30px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}