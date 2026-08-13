"use client";

import Link from "next/link";
import SuccessCheck from "@/components/SuccessCheck";
import { useApplyDraft, feeForAmount } from "@/lib/applyContext";

const TIMELINE = [
  { label: "Application Submitted", done: true },
  { label: "Payment Confirmed", done: true },
  { label: "Eligibility Review", done: false, active: true },
  { label: "Partner Matching", done: false },
  { label: "Loan Option", done: false },
];

export default function SubmittedPage() {
  const { draft } = useApplyDraft();

  return (
    <div className="container-mobile py-10 text-center md:max-w-sm">
      <div className="mb-4">
        <SuccessCheck size={72} />
      </div>
      <h1 className="mb-1">Payment Confirmed</h1>
      <p className="mb-6 text-sm text-ink-500">₹{feeForAmount(draft.amount)} received — application submitted</p>

      <p className="mb-1 text-xs font-semibold uppercase text-ink-500">Application ID</p>
      <p className="mb-6 font-mono text-xl font-bold text-ink">{draft.applicationId ?? "—"}</p>

      <div className="card mb-6 text-left">
        <ul className="space-y-3">
          {TIMELINE.map((t, i) => (
            <li
              key={t.label}
              className="flex items-center gap-3 text-sm opacity-0"
              style={{ animation: `ls-fade-in 0.4s ease-out ${0.3 + i * 0.12}s forwards` }}
            >
              <span aria-hidden className={t.done ? "text-success" : t.active ? "text-marigold-700" : "text-ink-500"}>
                {t.done ? "✓" : t.active ? "●" : "○"}
              </span>
              <span className={t.done || t.active ? "font-medium text-ink" : "text-ink-500"}>{t.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mb-1 font-medium text-ink">Your application is being reviewed.</p>
      <p className="mb-6 text-sm text-ink-500">
        We will notify you by call/SMS/WhatsApp if an applicable loan option is available.
      </p>

      <Link href="/dashboard" className="btn-primary">TRACK APPLICATION</Link>

      <style>{`
        @keyframes ls-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
