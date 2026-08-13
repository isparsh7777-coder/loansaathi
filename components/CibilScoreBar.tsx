"use client";

import { useState } from "react";

const BANDS = [
  { max: 579, label: "Poor", color: "bg-caution" },
  { max: 669, label: "Fair", color: "bg-marigold-600" },
  { max: 739, label: "Good", color: "bg-marigold" },
  { max: 799, label: "Very Good", color: "bg-success" },
  { max: 900, label: "Excellent", color: "bg-success" },
];

function bandFor(score: number) {
  return BANDS.find((b) => score <= b.max) ?? BANDS[BANDS.length - 1];
}

export default function CibilScoreBar({
  onChange,
}: {
  onChange?: (score: number | null) => void;
}) {
  const [score, setScore] = useState<number>(700);
  const [dontKnow, setDontKnow] = useState(false);
  const band = bandFor(score);
  const pct = ((score - 300) / (900 - 300)) * 100;

  return (
    <div className="card">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Your Estimated Credit Score</p>
        <label className="flex items-center gap-1.5 text-xs text-ink-500">
          <input
            type="checkbox"
            checked={dontKnow}
            onChange={(e) => {
              setDontKnow(e.target.checked);
              onChange?.(e.target.checked ? null : score);
            }}
            className="accent-marigold-600"
          />
          I don&apos;t know
        </label>
      </div>

      {!dontKnow && (
        <>
          <p className="mb-1 text-center text-3xl font-bold text-ink">{score}</p>
          <p className={`mb-3 text-center text-xs font-semibold ${band.color === "bg-caution" ? "text-caution" : "text-success"}`}>
            {band.label}
          </p>
          <div className="relative mb-2 h-2 rounded-pill bg-line">
            <div
              className="absolute inset-y-0 left-0 rounded-pill bg-gradient-to-r from-caution via-marigold to-success"
              style={{ width: `${pct}%` }}
            />
          </div>
          <input
            type="range"
            min={300}
            max={900}
            step={1}
            value={score}
            onChange={(e) => {
              const v = Number(e.target.value);
              setScore(v);
              onChange?.(v);
            }}
            className="w-full accent-marigold-600"
            aria-label="Estimated credit score"
          />
          <div className="mt-1 flex justify-between text-xs text-ink-500">
            <span>300</span>
            <span>900</span>
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-ink-500">
        This is a self-declared estimate to help guide your application — not
        a live pull from a credit bureau. Your actual score, if needed, will
        only be checked with your explicit consent on the next step.
      </p>
    </div>
  );
}
