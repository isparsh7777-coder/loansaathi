"use client";

import { useEffect, useState } from "react";
import { STATUS_INFO } from "@/lib/statusInfo";

const TONE_COLOR: Record<string, string> = {
  neutral: "bg-ink-500",
  progress: "bg-marigold",
  success: "bg-success",
  caution: "bg-caution",
};

export default function StatusProgressBar({ status }: { status: string }) {
  const info = STATUS_INFO[status] ?? STATUS_INFO.submitted;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(info.percent), 100);
    return () => clearTimeout(t);
  }, [info.percent]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{info.label}</span>
        <span className="text-xs text-ink-500">{info.percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-pill bg-line">
        <div
          className={`h-full rounded-pill transition-all duration-1000 ease-out ${TONE_COLOR[info.tone]}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-ink-500">{info.description}</p>
    </div>
  );
}
