"use client";

import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // =========================
  // LOAD CART
  // =========================
  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // =========================
  // UPDATE QUANTITY
  // =========================
  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setLoadingId(productId);

      await api.updateCart(productId, quantity);

      await loadCart();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoadingId(null);
    }
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const removeItem = async (productId: number) => {
    if (!confirm("Remove this product from cart?")) return;

    try {
      await api.removeCartItem(productId);

      await loadCart();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  // =========================
  // TOTAL CART
  // =========================
  const total = cart.reduce((sum, item) => sum + item.total, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  if (loading) {
    return <div className="cart-page">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      {cart.length === 0 && (
        <div className="empty">
          <p>Your cart is empty</p>

          <button onClick={() => router.push("/")}>
            Continue Shopping
          </button>
        </div>
      )}

      {cart.length > 0 && (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.productName}
                />

                <div className="cart-info">
                  <h3>{item.productName}</h3>

                  <p className="price">
                    {formatPrice(item.price)}
                  </p>

                  <div className="qty">
                    <button
                      disabled={loadingId === item.productId}
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={loadingId === item.productId}
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <p className="subtotal">
                    Subtotal: {formatPrice(item.total)}
                  </p>

                  <button
                    className="remove"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="cart-summary">
            <h2>Total: {formatPrice(total)}</h2>

            <button
              className="checkout"
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .cart-page {
          max-width: 900px;
          margin: auto;
          padding: 40px 20px;
        }

        h1 {
          margin-bottom: 30px;
        }

        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: flex;
          gap: 20px;
          border: 1px solid #eee;
          padding: 20px;
          background: white;
        }

        .cart-item img {
          width: 120px;
          height: 120px;
          object-fit: cover;
        }

        .cart-info {
          flex: 1;
        }

        .price {
          font-weight: bold;
          margin: 5px 0;
        }

        .qty {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0;
        }

        .qty button {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .subtotal {
          margin-top: 5px;
          color: #666;
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

        .checkout {
          margin-top: 10px;
          padding: 12px 20px;
          background: black;
          color: white;
          border: none;
          cursor: pointer;
        }

        .empty {
          text-align: center;
        }

        .empty button {
          margin-top: 20px;
          padding: 10px 20px;
        }
      `}</style>
    </div>
  );
}