import { Suspense } from "react";
import CheckoutClient from "@/src/app/(user)/checkout/CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}