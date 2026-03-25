"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutClient() {
  const params = useSearchParams();
  const router = useRouter();

  const productId = params.get("productId");
  const quantity = Number(params.get("quantity")) || 1;

  const [product, setProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ===============================
  // LOAD DATA
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);

        if (productId) {
          const data = await api.getUserProductById(Number(productId));
          setProduct(data);
        } else {
          const cart = await api.getCart();
          setCartItems(cart || []);
        }
      } catch (err: any) {
        alert(err.message);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // ===============================
  // FORMAT PRICE
  // ===============================
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  // ===============================
  // TOTAL
  // ===============================
  let total = 0;

  if (product) {
    total = (product.discountPrice || product.price) * quantity;
  }

  if (cartItems.length > 0) {
    total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  // ===============================
  // CHECKOUT
  // ===============================
  const handleCheckout = async () => {
    try {
      setLoading(true);

      let order;

      // BUY NOW
      if (productId) {
        order = await api.buyNow(
          Number(productId),
          quantity,
          paymentMethod
        );
      } else {
        order = await api.checkoutCart(paymentMethod);
      }

      // ===============================
      // VNPAY FLOW
      // ===============================
      if (paymentMethod === "VNPAY") {
        const res = await fetch(`${API_URL}/api/payment/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            orderId: order.id,
            paymentMethod: "VNPAY",
          }),
        });

        const data = await res.json();
        const paymentUrl = data.paymentUrl;

        if (!paymentUrl) {
          throw new Error("Cannot create VNPAY payment");
        }

        window.location.href = paymentUrl;
        return;
      }

      // ===============================
      // COD FLOW
      // ===============================
      alert("Order placed successfully");
      router.push("/orders");

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <h2>Loading checkout...</h2>;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {/* BUY NOW */}
      {product && (
        <div className="item">
          <img src={getImageUrl(product.mainImage)} />
          <div>
            <h3>{product.name}</h3>
            <p>Quantity: {quantity}</p>
            <p>{formatPrice(product.discountPrice || product.price)}</p>
          </div>
        </div>
      )}

      {/* CART */}
      {cartItems.map((item) => (
        <div key={item.productId} className="item">
          <img src={getImageUrl(item.image)} />
          <div>
            <h3>{item.productName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}

      {/* PAYMENT */}
      <div className="payment-section">
        <h2>Payment Method</h2>

        <label>
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash On Delivery
        </label>

        <label>
          <input
            type="radio"
            value="VNPAY"
            checked={paymentMethod === "VNPAY"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          VNPAY
        </label>
      </div>

      {/* TOTAL */}
      <div className="total">
        Total: <strong>{formatPrice(total)}</strong>
      </div>

      {/* BUTTON */}
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>

      <style jsx>{`
        .checkout-page {
          max-width: 900px;
          margin: auto;
          padding: 40px 20px;
        }

        .item {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid #eee;
          padding: 15px 0;
        }

        .item img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }

        .payment-section {
          margin-top: 30px;
        }

        .total {
          margin-top: 20px;
          font-size: 20px;
        }

        button {
          margin-top: 20px;
          width: 100%;
          padding: 15px;
          background: black;
          color: white;
          border: none;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}