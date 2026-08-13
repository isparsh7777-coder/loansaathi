"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function TransitionOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 bg-paper/95 backdrop-blur-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-100 border-t-marigold" />
      <p className="text-sm font-medium text-ink-500">{message}</p>
    </div>
  );
}

/**
 * Adds a brief, reassuring pause (feels like "saving/processing") before
 * moving to the next step, instead of an instant jarring page swap.
 */
export function useStepNavigate(message = "Saving your details…") {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const navigate = useCallback(
    (path: string, delayMs = 1300) => {
      setTransitioning(true);
      setTimeout(() => router.push(path), delayMs);
    },
    [router]
  );

  return { navigate, transitioning, message };
}
