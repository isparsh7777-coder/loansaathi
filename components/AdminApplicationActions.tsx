"use client";

import { useState } from "react";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_ACTIONS: ApplicationStatus[] = [
  "under_review", "more_info_required", "eligible", "not_eligible",
  "referred_to_partner", "lender_decision_pending", "approved_by_lender", "disbursed",
];

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Submitted", under_review: "Under Review", more_info_required: "More Info Required",
  eligible: "Eligible", not_eligible: "Not Eligible", referred_to_partner: "Referred to Partner",
  lender_decision_pending: "Lender Decision Pending", approved_by_lender: "Approved by Lender",
  disbursed: "Disbursed",
};

export default function AdminApplicationActions({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function setStatus(status: ApplicationStatus) {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    setMessage(res.ok ? "Status updated." : "Failed to update status.");
    if (res.ok) setTimeout(() => window.location.reload(), 600);
  }

  async function overridePayment(paymentStatus: "paid" | "failed" | "refunded") {
    setBusy(true);
    setMessage(null);
    const res = await fetch(`/api/admin/applications/${applicationId}/payment-override`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentStatus,
        note: "Manual override — gateway did not confirm automatically",
      }),
    });
    setBusy(false);
    setMessage(res.ok ? "Payment status updated." : "Failed to update payment status.");
    if (res.ok) setTimeout(() => window.location.reload(), 600);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-xs font-semibold text-marigold-700"
      >
        Update
      </button>

      {open && (
        <div className="absolute right-4 z-10 mt-2 w-72 rounded-card border border-line bg-white p-4 shadow-card">
          <p className="mb-2 text-xs font-semibold uppercase text-ink-500">Application Status</p>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {STATUS_ACTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={busy}
                onClick={() => setStatus(s)}
                className="rounded-pill border border-ink px-2 py-1 text-[11px] font-semibold text-ink hover:bg-ink hover:text-white"
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold uppercase text-ink-500">
            Manual Payment Override
          </p>
          <p className="mb-2 text-[11px] text-ink-500">
            Use only when Cashfree couldn&apos;t confirm the payment automatically
            (cancelled, stuck processing, etc.) — this is logged with your name.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(["paid", "failed", "refunded"] as const).map((p) => (
              <button
                key={p}
                type="button"
                disabled={busy}
                onClick={() => overridePayment(p)}
                className="rounded-pill border border-caution px-2 py-1 text-[11px] font-semibold text-caution hover:bg-caution hover:text-white"
              >
                Mark {p}
              </button>
            ))}
          </div>

          {message && <p className="mt-2 text-[11px] text-ink-500">{message}</p>}
        </div>
      )}
    </div>
  );
}
