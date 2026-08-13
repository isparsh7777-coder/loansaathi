"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepProgress from "@/components/StepProgress";
import { TransitionOverlay } from "@/components/StepTransition";
import AuthPanel from "@/components/AuthPanel";
import { useApplyDraft } from "@/lib/applyContext";

export default function ApplyLoginStep() {
  const router = useRouter();
  const { update } = useApplyDraft();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.mobile) {
          update({ mobile: data.mobile });
          router.replace("/apply/loan-type");
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSuccess() {
    const res = await fetch("/api/customer/me");
    const data = res.ok ? await res.json() : null;
    if (data?.mobile) update({ mobile: data.mobile });
    router.push("/apply/loan-type");
  }

  if (checking) return <TransitionOverlay message="Checking your login…" />;

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      <StepProgress current={1} />
      <h1 className="mb-2">Log In or Create an Account</h1>
      <p className="mb-6 text-sm text-ink-500">
        You&apos;ll only need to do this once — you&apos;ll stay logged in for
        the rest of your visit.
      </p>
      <AuthPanel defaultMode="signup-mobile" onSuccess={handleSuccess} />
    </div>
  );
}
