import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [{ count: total }, { count: todayCount }, { count: underReview }, { count: eligible }, { count: moreInfo }, { count: notEligible }] =
    await Promise.all([
      supabase.from("loan_applications").select("*", { count: "exact", head: true }),
      supabase.from("loan_applications").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("loan_applications").select("*", { count: "exact", head: true }).eq("status", "under_review"),
      supabase.from("loan_applications").select("*", { count: "exact", head: true }).eq("status", "eligible"),
      supabase.from("loan_applications").select("*", { count: "exact", head: true }).eq("status", "more_info_required"),
      supabase.from("loan_applications").select("*", { count: "exact", head: true }).eq("status", "not_eligible"),
    ]);

  return {
    total: total ?? 0,
    today: todayCount ?? 0,
    underReview: underReview ?? 0,
    eligible: eligible ?? 0,
    moreInfo: moreInfo ?? 0,
    notEligible: notEligible ?? 0,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const stats = [
    { label: "Total Applications", value: counts.total, accent: "border-ink-100", text: "text-ink" },
    { label: "Today's Applications", value: counts.today, accent: "border-marigold", text: "text-marigold-700" },
    { label: "Under Review", value: counts.underReview, accent: "border-caution", text: "text-caution" },
    { label: "Eligible", value: counts.eligible, accent: "border-success", text: "text-success" },
    { label: "More Information", value: counts.moreInfo, accent: "border-caution", text: "text-caution" },
    { label: "Not Eligible", value: counts.notEligible, accent: "border-ink-100", text: "text-ink-500" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`card border-l-4 ${s.accent} opacity-0`}
            style={{ animation: `ls-fade-in 0.4s ease-out ${i * 0.06}s forwards` }}
          >
            <p className={`text-2xl font-bold ${s.text}`}>{s.value.toLocaleString("en-IN")}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>
      <a
        href="/admin/applications"
        className="mt-8 inline-block rounded-pill bg-ink px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        View All Applications →
      </a>

      <style>{`
        @keyframes ls-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
