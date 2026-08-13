"use client";

import { useState } from "react";
import SuccessCheck from "@/components/SuccessCheck";

type Mode =
  | "login" | "login-locked"
  | "signup-mobile" | "signup-otp" | "signup-password"
  | "forgot-mobile" | "forgot-otp" | "forgot-password"
  | "success";

async function postJSON(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

export default function AuthPanel({
  onSuccess,
  defaultMode = "login",
}: {
  onSuccess: () => void;
  defaultMode?: "login" | "signup-mobile";
}) {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stubMode, setStubMode] = useState(false);

  function resetTransient() {
    setError(null);
    setOtp("");
  }

  async function sendOtp(purpose: "signup" | "reset") {
    resetTransient();
    if (!/^\d{10}$/.test(mobile)) return setError("Enter a valid 10-digit mobile number");
    setLoading(true);
    const { ok, data } = await postJSON("/api/otp/send", { mobile, purpose });
    setLoading(false);
    if (!ok) return setError(data.error);
    setStubMode(!!data.stubMode);
    setMode(purpose === "signup" ? "signup-otp" : "forgot-otp");
  }

  async function verifyOtp(nextMode: Mode) {
    resetTransient();
    setLoading(true);
    const { ok, data } = await postJSON("/api/otp/verify", { otp });
    setLoading(false);
    if (!ok) return setError(data.error);
    setMode(nextMode);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\d{10}$/.test(mobile) || !password) return setError("Enter your mobile number and password");
    setLoading(true);
    const { ok, data } = await postJSON("/api/auth/login", { mobile, password });
    setLoading(false);
    if (!ok) return setError(data.error);
    setMode("success");
    setTimeout(onSuccess, 1400);
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError("Passwords don't match");
    setLoading(true);
    const { ok, data } = await postJSON("/api/auth/signup", { password });
    setLoading(false);
    if (!ok) return setError(data.error);
    setMode("success");
    setTimeout(onSuccess, 1400);
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) return setError("Passwords don't match");
    setLoading(true);
    const { ok, data } = await postJSON("/api/auth/reset-password", { password });
    setLoading(false);
    if (!ok) return setError(data.error);
    setMode("success");
    setTimeout(onSuccess, 1400);
  }

  if (mode === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <SuccessCheck />
        <p className="mt-4 text-lg font-semibold text-success">You&apos;re in!</p>
        <p className="mt-1 text-sm text-ink-500">Setting things up…</p>
      </div>
    );
  }

  return (
    <div>
      {(mode === "login" || mode === "signup-mobile") && (
        <div className="mb-5 flex rounded-pill border border-line p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); resetTransient(); }}
            className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors ${
              mode === "login" ? "bg-ink text-white" : "text-ink-500"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup-mobile"); resetTransient(); }}
            className={`flex-1 rounded-pill py-2 text-sm font-semibold transition-colors ${
              mode === "signup-mobile" ? "bg-ink text-white" : "text-ink-500"
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {mode === "login" && (
        <form onSubmit={handleLogin} className="space-y-4">
          <MobileInput value={mobile} onChange={setMobile} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
            />
          </label>
          {error && <p className="text-sm font-medium text-caution">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Logging in…" : "LOG IN"}
          </button>
          <button
            type="button"
            onClick={() => { setMode("forgot-mobile"); resetTransient(); }}
            className="block w-full text-center text-sm text-marigold-700 underline"
          >
            Forgot password?
          </button>
        </form>
      )}

      {mode === "signup-mobile" && (
        <div className="space-y-4">
          <MobileInput value={mobile} onChange={setMobile} />
          {error && <p className="text-sm font-medium text-caution">{error}</p>}
          <button type="button" onClick={() => sendOtp("signup")} disabled={loading} className="btn-primary">
            {loading ? "Sending…" : "SEND OTP"}
          </button>
        </div>
      )}

      {(mode === "signup-otp" || mode === "forgot-otp") && (
        <div className="space-y-4">
          <p className="text-sm text-ink-500">Enter the 6-digit code sent to +91 {mobile}</p>
          {stubMode && (
            <p className="rounded-card border border-caution-100 bg-caution-100/40 p-2 text-xs text-caution">
              Demo mode: use 123456 to test.
            </p>
          )}
          <input
            type="text" inputMode="numeric" maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="_ _ _ _ _ _"
            className={`w-full rounded-card border bg-white px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none ${
              error ? "border-caution" : "border-line"
            }`}
          />
          {error && <p className="text-sm font-medium text-caution">{error}</p>}
          <button
            type="button"
            onClick={() => verifyOtp(mode === "signup-otp" ? "signup-password" : "forgot-password")}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Verifying…" : "VERIFY OTP"}
          </button>
        </div>
      )}

      {(mode === "signup-password" || mode === "forgot-password") && (
        <form onSubmit={mode === "signup-password" ? handleCreateAccount : handleResetPassword} className="space-y-4">
          <p className="text-sm font-medium text-success">✓ Mobile verified</p>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">
              {mode === "signup-password" ? "Create Password" : "New Password"}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
            />
            <span className="mt-1 block text-xs text-ink-500">At least 8 characters, with letters and numbers</span>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
            />
          </label>
          {error && <p className="text-sm font-medium text-caution">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving…" : mode === "signup-password" ? "CREATE ACCOUNT" : "RESET PASSWORD"}
          </button>
        </form>
      )}

      {mode === "forgot-mobile" && (
        <div className="space-y-4">
          <p className="text-sm text-ink-500">Enter your registered mobile number to reset your password.</p>
          <MobileInput value={mobile} onChange={setMobile} />
          {error && <p className="text-sm font-medium text-caution">{error}</p>}
          <button type="button" onClick={() => sendOtp("reset")} disabled={loading} className="btn-primary">
            {loading ? "Sending…" : "SEND OTP"}
          </button>
          <button
            type="button"
            onClick={() => { setMode("login"); resetTransient(); }}
            className="block w-full text-center text-sm text-ink-500 underline"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
}

function MobileInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">Mobile Number</span>
      <div className="flex items-center rounded-card border border-line bg-white px-3">
        <span className="text-ink-500">+91</span>
        <input
          type="tel" inputMode="numeric" maxLength={10}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
          placeholder="XXXXX XXXXX"
          className="w-full bg-transparent px-2 py-3 text-lg outline-none"
        />
      </div>
    </label>
  );
}
