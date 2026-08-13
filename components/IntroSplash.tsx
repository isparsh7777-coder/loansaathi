"use client";

import { useEffect, useState } from "react";

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("ls_intro_seen");
    if (alreadySeen) return;

    setVisible(true);
    const fadeTimer = setTimeout(() => setFadeOut(true), 900);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("ls_intro_seen", "1");
    }, 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-400 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <p className="mb-3 animate-pulse text-3xl font-bold text-white">
        Loan<span className="text-marigold">Saathi</span>
      </p>
      <div className="h-1 w-32 overflow-hidden rounded-pill bg-white/20">
        <div className="h-full w-full origin-left animate-[loadbar_1s_ease-in-out] bg-marigold" />
      </div>
      <style>{`
        @keyframes loadbar {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
