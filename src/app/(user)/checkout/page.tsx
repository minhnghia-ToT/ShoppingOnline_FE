"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, getImageUrl } from "@/src/lib/api";

export default function CheckoutPage() {
  const params = useSearchParams();
  const router = useRouter();

  const productId = params.get("productId");
 const quantity = Number(params.get("quantity")) || 1;

  const [product, setProduct] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      const data = await api.getUserProductById(Number(productId));
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const total =
    product &&
    (product.discountPrice || product.price) * quantity;

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

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {product && (
        <div className="product">
          <img src={getImageUrl(product.mainImage)} />

          <div>
            <h3>{product.name}</h3>
            <p>Quantity: {quantity}</p>
            <p>{formatPrice(product.discountPrice || product.price)}</p>
          </div>
        </div>
      )}

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