"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LoanApplication } from "@/lib/types";
import { LOAN_TYPE_LABELS } from "@/lib/types";
import StatusProgressBar from "@/components/StatusProgressBar";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    fetch("/api/customer/me")
      .then(async (res) => {
        if (res.status === 401) {
          setLoggedOut(true);
          return;
        }
        const data = await res.json();
        setApplications(data.applications ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container-mobile py-10 text-center text-ink-500">Loading…</div>;
  }

  if (loggedOut) {
    return (
      <div className="container-mobile py-10 text-center md:max-w-sm">
        <h1 className="mb-3">Please Log In</h1>
        <p className="mb-6 text-sm text-ink-500">Log in to see your applications.</p>
        <Link href="/login" className="btn-primary">LOG IN</Link>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="container-mobile py-10 text-center md:max-w-sm">
        <h1 className="mb-3">No Applications Yet</h1>
        <Link href="/apply/otp" className="btn-primary">GET LOAN</Link>
      </div>
    );
  }

  return (
    <div className="container-mobile py-8 md:max-w-sm">
      <h1 className="mb-6">Your Applications</h1>
      <div className="space-y-4">
        {applications.map((app, i) => (
          <div
            key={app.id}
            className="card opacity-0"
            style={{ animation: `ls-fade-in 0.4s ease-out ${i * 0.08}s forwards` }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-xs text-ink-500">{app.id}</p>
              <p className="text-xs text-ink-500">
                {new Date(app.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
            <p className="mb-1 font-semibold text-ink">{LOAN_TYPE_LABELS[app.loan_type]}</p>
            <p className="mb-3 text-sm text-ink-500">₹{Number(app.requested_amount).toLocaleString("en-IN")}</p>
            <StatusProgressBar status={app.status} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ls-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
