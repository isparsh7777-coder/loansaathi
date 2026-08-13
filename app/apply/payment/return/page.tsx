"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentReturnPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const [status, setStatus] = useState<"checking" | "paid" | "failed">("checking");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }
    fetch(`/api/apply/verify-order?order_id=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.orderStatus === "PAID") {
          setStatus("paid");
          router.push("/apply/submitted");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [orderId, router]);

  return (
    <div className="container-mobile py-16 text-center md:max-w-sm">
      {status === "checking" && <p className="text-ink-500">Confirming your payment…</p>}
      {status === "failed" && (
        <>
          <h1 className="mb-2">Payment Not Confirmed</h1>
          <p className="text-sm text-ink-500">
            We couldn&apos;t confirm this payment. If money was deducted, it will
            be automatically reconciled — please try again or contact support.
          </p>
        </>
      )}
    </div>
  );
}
