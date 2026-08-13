"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay } from "@/components/StepTransition";
import { useApplyDraft } from "@/lib/applyContext";
import { LOAN_TYPE_LABELS } from "@/lib/types";

export default function ReviewStep() {
  const router = useRouter();
  const { draft, update } = useApplyDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = [
    { label: "Loan Type", value: draft.loanType ? LOAN_TYPE_LABELS[draft.loanType] : "—", editHref: "/apply/loan-type" },
    { label: "Name", value: `${draft.firstName} ${draft.surname}`.trim(), editHref: "/apply/personal-details" },
    { label: "Amount", value: `₹${draft.amount.toLocaleString("en-IN")}`, editHref: "/apply/loan-amount" },
    { label: "Tenure", value: draft.tenureYears ? `${draft.tenureYears} Years` : "—", editHref: "/apply/tenure" },
    { label: "Employment", value: draft.employmentType ?? "—", editHref: "/apply/employment" },
    { label: "Monthly Income", value: draft.monthlyIncome ? `₹${draft.monthlyIncome.toLocaleString("en-IN")}` : "—", editHref: "/apply/employment" },
  ];

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/applications/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanType: draft.loanType,
        amount: draft.amount,
        tenureYears: draft.tenureYears,
        employmentType: draft.employmentType,
        monthlyIncome: draft.monthlyIncome,
        purpose: draft.purpose,
        creditConsent: draft.creditConsent,
        firstName: draft.firstName,
        surname: draft.surname,
        dob: draft.dob,
        pan: draft.pan,
        aadhaar: draft.aadhaar,
        houseNo: draft.houseNo,
        area: draft.area,
        addressLine1: draft.addressLine1,
        addressLine2: draft.addressLine2,
        city: draft.city,
        pincode: draft.pincode,
      }),
    });
    const data = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      setError(data.error ?? "Could not submit your application");
      return;
    }

    update({ applicationId: data.applicationId });
    setTimeout(() => router.push("/apply/payment"), 1200);
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {submitting && <TransitionOverlay message="Submitting your application…" />}
      <StepProgress current={7} />
      <h1 className="mb-6">Check Your Application</h1>

      <div className="card mb-6 divide-y divide-line">
        {summary.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm text-ink-500">{row.label}</p>
              <p className="font-semibold text-ink">{row.value || "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => router.push(row.editHref)}
              className="text-xs font-semibold text-marigold-700 underline"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {error && <p className="mb-4 text-sm font-medium text-caution">{error}</p>}

      <p className="mb-4 text-center text-sm font-medium text-ink">Everything look correct?</p>
      <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary">
        {submitting ? "Submitting…" : "SUBMIT APPLICATION"}
      </button>
    </div>
  );
}
