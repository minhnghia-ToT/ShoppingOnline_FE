"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";

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

  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);

        // BUY NOW
        if (productId) {
          const data = await api.getUserProductById(Number(productId));
          setProduct(data);
        }
        // CART
        else {
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

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

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

  const handleCheckout = async () => {
    try {
      setLoading(true);

      if (productId) {
        await api.buyNow(Number(productId), quantity, paymentMethod);
      } else {
        await api.checkoutCart(paymentMethod);
      }

      alert("Order placed successfully");
      router.push("/order");
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
          <img src={getImageUrl(product.mainImage)} width={100} />
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
          <img src={getImageUrl(item.image)} width={100} />
          <div>
            <h3>{item.productName}</h3>
            <p>Quantity: {item.quantity}</p>
            <p>{formatPrice(item.price)}</p>
          </div>
        </div>
      ))}

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
          value="MOMO"
          checked={paymentMethod === "MOMO"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        MOMO
      </label>

      <div className="total">
        Total: {formatPrice(total)}
      </div>

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
}