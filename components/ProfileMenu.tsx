"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfileMenu() {
  const [mobile, setMobile] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMobile(data?.mobile ?? null))
      .finally(() => setLoaded(true));
  }, []);

  async function logout() {
    await fetch("/api/customer/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!loaded) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-ink-100" />;
  }

  if (!mobile) {
    return (
      <Link
        href="/apply/otp"
        className="rounded-pill border-2 border-ink px-4 py-2 text-sm font-semibold text-ink"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-white"
        aria-label="Profile menu"
      >
        {mobile.slice(-2)}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-card border border-line bg-white p-3 shadow-card">
          <p className="mb-1 text-xs text-ink-500">Logged in as</p>
          <p className="mb-3 text-sm font-semibold text-ink">{mobile}</p>
          <Link
            href="/dashboard"
            className="mb-2 block rounded-pill border border-ink px-3 py-2 text-center text-sm font-semibold text-ink"
            onClick={() => setOpen(false)}
          >
            My Applications
          </Link>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-pill bg-caution px-3 py-2 text-sm font-semibold text-white"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
