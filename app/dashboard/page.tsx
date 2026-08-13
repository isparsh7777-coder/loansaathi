"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LoanApplication } from "@/lib/types";
import { LOAN_TYPE_LABELS } from "@/lib/types";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  more_info_required: "More Info Required",
  eligible: "Eligible",
  not_eligible: "Not Eligible",
  referred_to_partner: "Referred to Partner",
  lender_decision_pending: "Lender Decision Pending",
  approved_by_lender: "Approved by Lender",
  disbursed: "Disbursed",
};

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
        <p className="mb-6 text-sm text-ink-500">
          Verify your mobile number to see your applications.
        </p>
        <Link href="/track-application" className="btn-primary">LOG IN WITH OTP</Link>
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
        {applications.map((app) => (
          <div key={app.id} className="card">
            <p className="mb-1 font-mono text-xs text-ink-500">{app.id}</p>
            <p className="mb-2 font-semibold text-ink">{LOAN_TYPE_LABELS[app.loan_type]}</p>
            <span className="inline-block rounded-pill bg-caution-100 px-3 py-1 text-xs font-semibold text-caution">
              {STATUS_LABELS[app.status] ?? app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
