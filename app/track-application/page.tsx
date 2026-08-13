"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stubMode, setStubMode] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Could not send OTP");
    setStubMode(!!data.stubMode);
    setStep("otp");
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Could not verify OTP");
    router.push("/dashboard");
  }

  return (
    <div className="container-mobile py-10 md:max-w-sm">
      <h1 className="mb-2 text-center">Track Your Loan Application</h1>
      <p className="mb-6 text-center text-sm text-ink-500">
        Enter your mobile number to check your application status.
      </p>

      {step === "mobile" && (
        <form onSubmit={sendOtp} className="space-y-4">
          <div className="flex items-center rounded-card border border-line bg-white px-3">
            <span className="text-ink-500">+91</span>
            <input
              type="tel" inputMode="numeric" maxLength={10} required
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="XXXXX XXXXX"
              className="w-full bg-transparent px-2 py-4 text-lg outline-none"
            />
          </div>
          {error && <p className="text-sm text-caution">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Sending…" : "SEND OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOtp} className="space-y-4">
          {stubMode && (
            <p className="rounded-card border border-caution-100 bg-caution-100/40 p-2 text-xs text-caution">
              Demo mode: use 123456 to test.
            </p>
          )}
          <input
            type="text" inputMode="numeric" maxLength={6} required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="_ _ _ _ _ _"
            className="w-full rounded-card border border-line bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none"
          />
          {error && <p className="text-sm text-caution">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Verifying…" : "VERIFY & CONTINUE"}
          </button>
        </form>
      )}
    </div>
  );
}
