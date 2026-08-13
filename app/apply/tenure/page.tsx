"use client";

import { useState } from "react";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import { useApplyDraft } from "@/lib/applyContext";

const TENURES = [1, 2, 3, 5, 7, 10];

export default function TenureStep() {
  const { draft, update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Saving your details…");
  const [selected, setSelected] = useState<number | null>(draft.tenureYears);

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={5} />
      <h1 className="mb-6">Select Loan Tenure</h1>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {TENURES.map((yrs) => (
          <button
            key={yrs}
            type="button"
            onClick={() => setSelected(yrs)}
            className={`card text-center ${selected === yrs ? "border-marigold ring-2 ring-marigold" : ""}`}
          >
            <span className="text-lg font-bold text-ink">{yrs}</span>
            <span className="block text-xs text-ink-500">{yrs === 1 ? "Year" : "Years"}</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={() => {
          update({ tenureYears: selected });
          navigate("/apply/credit-consent");
        }}
        className="btn-primary"
      >
        CONTINUE
      </button>
    </div>
  );
}
