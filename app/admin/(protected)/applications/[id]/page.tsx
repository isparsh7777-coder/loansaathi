import { createClient } from "@/lib/supabase/server";
import AdminApplicationActions from "@/components/AdminApplicationActions";
import { LOAN_TYPE_LABELS } from "@/lib/types";
import { STATUS_INFO } from "@/lib/statusInfo";

async function getApplication(id: string) {
  const supabase = createClient();
  const { data: application } = await supabase
    .from("loan_applications")
    .select("*, customers(mobile_number, full_name, address)")
    .eq("id", id)
    .single();

  const { data: history } = await supabase
    .from("application_status_history")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: false });

  return { application, history: history ?? [] };
}

export default async function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const { application: app, history } = await getApplication(params.id);

  if (!app) {
    return <div className="mx-auto max-w-3xl px-4 py-8">Application not found.</div>;
  }

  const statusInfo = STATUS_INFO[app.status];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-ink-500">{app.id}</p>
          <h1>{LOAN_TYPE_LABELS[app.loan_type as keyof typeof LOAN_TYPE_LABELS]}</h1>
        </div>
        <div className="relative">
          <AdminApplicationActions applicationId={app.id} />
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <DetailCard title="Applicant">
          <Row label="Mobile" value={app.customers?.mobile_number} />
          <Row label="Name" value={app.customers?.full_name} />
          <Row label="Address" value={app.customers?.address} />
        </DetailCard>

        <DetailCard title="Loan Details">
          <Row label="Amount Requested" value={`₹${Number(app.requested_amount).toLocaleString("en-IN")}`} />
          <Row label="Tenure" value={`${app.tenure_years} years`} />
          <Row label="Purpose" value={app.purpose} />
          <Row label="Employment" value={app.employment_type} />
          <Row label="Monthly Income" value={app.monthly_income ? `₹${Number(app.monthly_income).toLocaleString("en-IN")}` : "—"} />
        </DetailCard>

        <DetailCard title="Consent & Verification">
          <Row label="Credit Consent" value={app.credit_consent_given ? "Given" : "Not given"} />
          <Row label="Consent At" value={app.credit_consent_at ? new Date(app.credit_consent_at).toLocaleString("en-IN") : "—"} />
        </DetailCard>

        <DetailCard title="Payment">
          <Row label="Status" value={app.payment_status} />
          <Row label="Service Charge" value={app.service_charge_amount ? `₹${app.service_charge_amount}` : "—"} />
          <Row label="Cashfree Order ID" value={app.cashfree_order_id ?? "—"} />
        </DetailCard>
      </div>

      {statusInfo && (
        <div className="card mb-6">
          <p className="mb-1 text-xs font-semibold uppercase text-ink-500">Current Status</p>
          <p className="mb-2 font-semibold text-ink">{statusInfo.label}</p>
          <p className="text-sm text-ink-500">{statusInfo.description}</p>
        </div>
      )}

      <div className="card">
        <p className="mb-3 text-xs font-semibold uppercase text-ink-500">History</p>
        <ul className="space-y-3">
          {history.map((h: any) => (
            <li key={h.id} className="border-l-2 border-line pl-3 text-sm">
              <p className="font-medium text-ink">{h.to_status}</p>
              <p className="text-xs text-ink-500">
                {new Date(h.created_at).toLocaleString("en-IN")} · {h.changed_by}
              </p>
              {h.note && <p className="text-xs text-ink-500">{h.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <p className="mb-3 text-xs font-semibold uppercase text-ink-500">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="font-medium text-ink">{value || "—"}</span>
    </div>
  );
}
