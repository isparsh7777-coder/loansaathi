"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import SuccessCheck from "@/components/SuccessCheck";
import { useApplyDraft } from "@/lib/applyContext";

export default function OtpStep() {
  const router = useRouter();
  const { update } = useApplyDraft();
  const [stage, setStage] = useState<"mobile" | "otp" | "verified">("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stubMode, setStubMode] = useState(false);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
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
    setStage("otp");
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

    if (!res.ok) {
      setError(data.error ?? "Incorrect OTP — please try again");
      return;
    }

    update({ mobile: `+91${mobile}` });
    setStage("verified");
    setTimeout(() => router.push("/apply/loan-type"), 2200);
  }

  if (stage === "verified") {
    return (
      <div className="container-mobile flex min-h-[70vh] flex-col items-center justify-center text-center md:max-w-sm">
        <SuccessCheck />
        <p className="mt-4 text-lg font-semibold text-success">OTP Verified</p>
        <p className="mt-1 text-sm text-ink-500">Taking you to your application…</p>
      </div>
    );
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      <StepProgress current={1} />

      {stage === "mobile" && (
        <>
          <h1 className="mb-2">Enter Your Mobile Number</h1>
          <p className="mb-6 text-sm text-ink-500">
            We&apos;ll use your mobile number to create your application and keep
            you updated.
          </p>
          <form className="space-y-4" onSubmit={sendOtp}>
            <div className="flex items-center rounded-card border border-line bg-white px-3">
              <span className="text-ink-500">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                placeholder="XXXXX XXXXX"
                className="w-full bg-transparent px-2 py-4 text-lg outline-none"
              />
            </div>
            {error && <p className="text-sm font-medium text-caution">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Sending…" : "SEND OTP"}
            </button>
          </form>
        </>
      )}

      {stage === "otp" && (
        <>
          <h1 className="mb-2">Verify Mobile</h1>
          <p className="mb-2 text-sm text-ink-500">Enter the 6-digit code sent to +91 {mobile}</p>
          {stubMode && (
            <p className="mb-4 rounded-card border border-caution-100 bg-caution-100/40 p-2 text-xs text-caution">
              Demo mode: no real SMS provider configured yet — use 123456 to test.
            </p>
          )}
          <form className="space-y-4" onSubmit={verifyOtp}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="_ _ _ _ _ _"
              className={`w-full rounded-card border bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none ${
                error ? "border-caution" : "border-line"
              }`}
            />
            {error && <p className="text-sm font-medium text-caution">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Verifying…" : "VERIFY & CONTINUE"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
