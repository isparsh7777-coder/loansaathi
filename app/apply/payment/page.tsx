"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import StepProgress from "@/components/StepProgress";
import { useApplyDraft, feeForAmount } from "@/lib/applyContext";

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "sandbox" | "production" }) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: "_self" | "_blank" | "_modal" }) => void;
    };
  }
}

const FEE_TIERS = [
  { range: "Up to ₹5 lakh", fee: 99 },
  { range: "₹5–₹10 lakh", fee: 199 },
  { range: "Above ₹10 lakh", fee: 499 },
];

const CASHFREE_MODE = (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") ?? "sandbox";

export default function PaymentStep() {
  const router = useRouter();
  const { draft } = useApplyDraft();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = feeForAmount(draft.amount);

  async function handlePay() {
    if (!draft.applicationId || !draft.mobile) {
      setError("Something went wrong — please restart your application.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/apply/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: draft.applicationId,
          amount: fee,
          customerMobile: draft.mobile.replace("+91", ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment could not be started");

      if (data.stubMode) {
        // Demo mode — confirm the (fake) payment server-side, then finish.
        await fetch("/api/apply/mark-paid-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: draft.applicationId }),
        });
        router.push("/apply/submitted");
        return;
      }

      if (!window.Cashfree) {
        throw new Error("Payment system is still loading — try again in a moment.");
      }
      window.Cashfree({ mode: CASHFREE_MODE }).checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />

      <StepProgress current={7} />
      <h1 className="mb-6">Applicable Service Charge</h1>

      <div className="card mb-6">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-line">
            {FEE_TIERS.map((t) => {
              const isCurrentTier = t.fee === fee;
              return (
                <tr key={t.range} className={isCurrentTier ? "font-semibold text-ink" : "text-ink-500"}>
                  <td className="py-2">{t.range}</td>
                  <td className="py-2 text-right">₹{t.fee}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-center text-sm text-ink-500">
          Your applicable charge: <span className="font-bold text-ink">₹{fee}</span>
        </p>
      </div>

      <p className="mb-6 rounded-card border border-caution-100 bg-caution-100/40 p-4 text-xs text-ink">
        <strong>Important:</strong> Payment of any applicable service/assistance
        charge does not guarantee loan approval. Loan approval, loan amount,
        interest rate, tenure and other terms are determined solely by the
        applicable lender based on its eligibility, underwriting, verification
        and internal policies.
      </p>

      <div className="mb-6 flex justify-center gap-4 text-xs">
        <a href="/legal/terms" className="text-marigold-700 underline">Terms & Conditions</a>
        <a href="/legal/privacy" className="text-marigold-700 underline">Privacy Policy</a>
        <a href="/legal/refund-policy" className="text-marigold-700 underline">Refund Policy</a>
      </div>

      {error && <p className="mb-4 text-sm font-medium text-caution">{error}</p>}

      <button type="button" onClick={handlePay} disabled={loading} className="btn-primary">
        {loading ? "Processing…" : `PAY ₹${fee} & SUBMIT`}
      </button>
    </div>
  );
}
