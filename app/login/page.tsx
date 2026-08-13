"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthPanel from "@/components/AuthPanel";
import { TransitionOverlay } from "@/components/StepTransition";

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.mobile) router.replace("/dashboard");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) return <TransitionOverlay message="Checking your login…" />;

  return (
    <div className="container-mobile py-10 md:max-w-sm">
      <h1 className="mb-2 text-center">Welcome to LoanSaathi</h1>
      <p className="mb-6 text-center text-sm text-ink-500">
        Log in or create an account to apply and track your applications.
      </p>
      <AuthPanel defaultMode="login" onSuccess={() => router.push("/dashboard")} />
    </div>
  );
}
