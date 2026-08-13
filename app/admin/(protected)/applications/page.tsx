import { createClient } from "@/lib/supabase/server";
import AdminApplicationActions from "@/components/AdminApplicationActions";
import { LOAN_TYPE_LABELS } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-ink-100 text-ink",
  under_review: "bg-caution-100 text-caution",
  more_info_required: "bg-caution-100 text-caution",
  eligible: "bg-success-100 text-success",
  not_eligible: "bg-ink-100 text-ink-500",
  referred_to_partner: "bg-marigold/20 text-marigold-700",
  lender_decision_pending: "bg-marigold/20 text-marigold-700",
  approved_by_lender: "bg-success-100 text-success",
  disbursed: "bg-success text-white",
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted", under_review: "Under Review", more_info_required: "More Info Required",
  eligible: "Eligible", not_eligible: "Not Eligible", referred_to_partner: "Referred to Partner",
  lender_decision_pending: "Lender Decision Pending", approved_by_lender: "Approved by Lender",
  disbursed: "Disbursed",
};

async function getApplications() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("loan_applications")
    .select("id, customer_id, loan_type, requested_amount, status, payment_status, created_at, customers(mobile_number)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Failed to load applications", error);
    return [];
  }
  return data ?? [];
}

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6">Applications</h1>

      {applications.length === 0 ? (
        <p className="text-sm text-ink-500">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-line bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-line bg-ink-100/40 text-xs uppercase text-ink-500">
              <tr>
                {["Application ID", "Mobile", "Loan Type", "Amount", "Status", "Payment", "Date", ""].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {applications.map((r: any) => (
                <tr key={r.id} className="relative">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3">{r.customers?.mobile_number ?? "—"}</td>
                  <td className="px-4 py-3">{LOAN_TYPE_LABELS[r.loan_type as keyof typeof LOAN_TYPE_LABELS] ?? r.loan_type}</td>
                  <td className="px-4 py-3">₹{Number(r.requested_amount).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-pill px-2 py-1 text-xs font-semibold ${STATUS_COLORS[r.status] ?? "bg-ink-100 text-ink"}`}>
                      {STATUS_LABELS[r.status] ?? r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">{r.payment_status}</td>
                  <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString("en-IN")}</td>
                  <td className="relative px-4 py-3">
                    <AdminApplicationActions applicationId={r.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
