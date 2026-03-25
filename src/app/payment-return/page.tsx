"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentReturn() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const responseCode = params.get("vnp_ResponseCode");
    const orderId = params.get("vnp_TxnRef");

    if (responseCode === "00") {
      alert("Thanh toán thành công!");
      router.push(`/orders/${orderId}`);
    } else {
      alert("Thanh toán thất bại!");
      router.push("/checkout");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 50 }}>
      <h2>Đang xử lý thanh toán...</h2>
    </div>
  );
}