"use client";

import { useState } from "react";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import AmountSlider from "@/components/AmountSlider";
import { useApplyDraft } from "@/lib/applyContext";

export default function LoanAmountStep() {
  const { draft, update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Saving your details…");
  const [amount, setAmount] = useState(draft.amount);
  const [purpose, setPurpose] = useState(draft.purpose);

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={5} />
      <h1 className="mb-6">How Much Do You Need?</h1>

      <div className="card mb-6">
        <AmountSlider defaultValue={amount} onChange={setAmount} />
      </div>

      <label className="mb-6 block">
        <span className="mb-1 block text-sm font-medium text-ink">Why Do You Need the Loan?</span>
        <select
          required
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
        >
          <option value="" disabled>Select a reason</option>
          <option value="medical">Medical expenses</option>
          <option value="education">Education</option>
          <option value="home_renovation">Home renovation</option>
          <option value="wedding">Wedding</option>
          <option value="business_expansion">Business expansion</option>
          <option value="debt_consolidation">Debt consolidation</option>
          <option value="other">Other</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() => {
          update({ amount, purpose });
          navigate("/apply/tenure");
        }}
        className="btn-primary"
        disabled={!purpose}
      >
        CONTINUE
      </button>
    </div>
  );
}
