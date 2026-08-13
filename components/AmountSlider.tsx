"use client";

import { useState } from "react";

function formatINR(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1).replace(/\.0$/, "")} Lakh`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AmountSlider({
  min = 5000,
  max = 5000000,
  step = 5000,
  defaultValue = 400000,
  onChange,
}: {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div>
      <p className="mb-2 text-center text-3xl font-bold text-ink">
        {formatINR(value)}
      </p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          setValue(v);
          onChange?.(v);
        }}
        className="w-full accent-marigold-600"
        aria-label="Loan amount"
      />
      <div className="mt-1 flex justify-between text-xs text-ink-500">
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}</span>
      </div>
    </div>
  );
}
