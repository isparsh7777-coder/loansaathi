"use client";

import { useState } from "react";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import { useApplyDraft } from "@/lib/applyContext";
import type { EmploymentType } from "@/lib/types";

const OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self Employed" },
  { value: "business_owner", label: "Business Owner" },
  { value: "professional", label: "Professional" },
  { value: "other", label: "Other" },
];

export default function EmploymentStep() {
  const { draft, update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Saving your details…");

  const [selected, setSelected] = useState<EmploymentType | null>(draft.employmentType);
  const [income, setIncome] = useState(draft.monthlyIncome ? String(draft.monthlyIncome) : "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(income);

    if (!income || Number.isNaN(value)) {
      setError("Enter your monthly income");
      return;
    }
    if (value < 10000) {
      setError("Monthly income must be at least ₹10,000");
      return;
    }
    if (income.length > 8) {
      setError("That doesn't look right — check the amount");
      return;
    }

    update({ employmentType: selected, monthlyIncome: value });
    navigate("/apply/loan-amount");
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={4} />
      <h1 className="mb-6">What Do You Do?</h1>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            className={`card text-center ${selected === opt.value ? "border-marigold ring-2 ring-marigold" : ""}`}
          >
            <span className="font-semibold text-ink">{opt.label}</span>
          </button>
        ))}
      </div>

      {selected && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Monthly Income (₹)</span>
            <input
              inputMode="numeric"
              value={income}
              onChange={(e) => {
                setError(null);
                setIncome(e.target.value.replace(/\D/g, "").slice(0, 8));
              }}
              placeholder="Minimum ₹10,000"
              className={`w-full rounded-card border bg-white px-4 py-3 outline-none ${
                error ? "border-caution" : "border-line"
              }`}
            />
            {error && <span className="mt-1 block text-xs font-medium text-caution">{error}</span>}
          </label>
          <button type="submit" className="btn-primary">CONTINUE</button>
        </form>
      )}
    </div>
  );
}
