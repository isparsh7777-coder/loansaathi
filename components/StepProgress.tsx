const STEPS = [
  "Mobile OTP",
  "Loan Type",
  "Details",
  "Employment",
  "Amount & Tenure",
  "Credit Consent",
  "Review",
];

export default function StepProgress({ current }: { current: number }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
        Step {current}/{STEPS.length} · {STEPS[current - 1]}
      </p>
      <div className="flex gap-1.5" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={STEPS.length}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`h-1.5 flex-1 rounded-pill ${
              i < current ? "bg-marigold" : "bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
