"use client";

import { useState } from "react";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay, useStepNavigate } from "@/components/StepTransition";
import CibilScoreBar from "@/components/CibilScoreBar";
import { useApplyDraft } from "@/lib/applyContext";

export default function CreditConsentStep() {
  const { update } = useApplyDraft();
  const { navigate, transitioning, message } = useStepNavigate("Saving your details…");
  const [agreed, setAgreed] = useState(false);
  const [score, setScore] = useState<number | null>(700);

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      {transitioning && <TransitionOverlay message={message} />}
      <StepProgress current={6} />
      <h1 className="mb-3">Check Your Credit Eligibility</h1>
      <p className="mb-6 text-sm text-ink-500">
        Your credit information may help lenders assess your eligibility. We
        will request the required consent before accessing or sharing any
        credit information.
      </p>

      <div className="mb-6">
        <CibilScoreBar onChange={setScore} />
      </div>

      <label className="card mb-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 accent-marigold-600"
        />
        <span className="text-sm text-ink">
          I consent to the collection, use and sharing of my information as
          necessary for assessing my loan application and connecting me with
          applicable lending partners, subject to the{" "}
          <a href="/legal/privacy" className="underline text-marigold-700">Privacy Policy</a> and applicable law.
        </span>
      </label>

      <button
        type="button"
        disabled={!agreed}
        onClick={() => {
          update({ creditConsent: agreed, cibilScore: score });
          navigate("/apply/review");
        }}
        className="btn-primary"
      >
        CONTINUE
      </button>
    </div>
  );
}
