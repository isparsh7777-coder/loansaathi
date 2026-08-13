"use client";

import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import { useApplyDraft } from "@/lib/applyContext";
import type { LoanType } from "@/lib/types";

const OPTIONS: { value: LoanType; label: string }[] = [
  { value: "personal", label: "Personal Loan" },
  { value: "business", label: "Business Loan" },
  { value: "home", label: "Home Loan" },
  { value: "vehicle", label: "Vehicle Loan" },
  { value: "education", label: "Education Loan" },
];

export default function LoanTypeStep() {
  const { update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Setting up your application…");

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={2} />
      <h1 className="mb-6">What Loan Do You Need?</h1>
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              update({ loanType: opt.value });
              navigate("/apply/personal-details");
            }}
            className="card flex w-full items-center justify-between text-left hover:border-marigold"
          >
            <span className="font-semibold text-ink">{opt.label}</span>
            <span aria-hidden className="text-marigold-700">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}
