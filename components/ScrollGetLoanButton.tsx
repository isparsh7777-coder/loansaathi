"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ScrollGetLoanButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-16 z-40 px-4 pb-2 transition-all duration-300 sm:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-mobile">
        <Link href="/apply/otp" className="btn-primary shadow-lg">
          GET LOAN
        </Link>
      </div>
    </div>
  );
}
