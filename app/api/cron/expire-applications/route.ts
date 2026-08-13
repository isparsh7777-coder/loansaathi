import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";

const STALE_STATUSES = ["submitted", "under_review", "more_info_required", "referred_to_partner", "lender_decision_pending"];

export async function GET(req: NextRequest) {
  // Vercel Cron sends this header automatically; also allow a manual
  // trigger with the same secret for testing.
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const supabase = createServiceRoleClient();

  const { data: stale, error: findError } = await supabase
    .from("loan_applications")
    .select("id, status")
    .in("status", STALE_STATUSES)
    .lt("created_at", threeMonthsAgo.toISOString());

  if (findError) {
    return NextResponse.json({ error: findError.message }, { status: 500 });
  }
  if (!stale || stale.length === 0) {
    return NextResponse.json({ ok: true, rejected: 0 });
  }

  const ids = stale.map((a) => a.id);

  const { error: updateError } = await supabase
    .from("loan_applications")
    .update({ status: "not_eligible", updated_at: new Date().toISOString() })
    .in("id", ids);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from("application_status_history").insert(
    stale.map((a) => ({
      application_id: a.id,
      from_status: a.status,
      to_status: "not_eligible",
      changed_by: "system",
      note: "Auto-rejected: no resolution after 3 months",
    }))
  );

  return NextResponse.json({ ok: true, rejected: ids.length });
}
