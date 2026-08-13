import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rateLimit";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!rateLimit(`admin_status_${user.id}`, 60, 60 * 5)) {
    return NextResponse.json({ error: "Too many requests. Slow down." }, { status: 429 });
  }
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { status: newStatus, note } = await req.json();
  const validStatuses = [
    "submitted", "under_review", "more_info_required", "eligible",
    "not_eligible", "referred_to_partner", "lender_decision_pending",
    "approved_by_lender", "disbursed",
  ];
  if (!validStatuses.includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: current } = await supabase
    .from("loan_applications")
    .select("status")
    .eq("id", params.id)
    .single();

  const { error: updateError } = await supabase
    .from("loan_applications")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: "Could not update status" }, { status: 500 });
  }

  await supabase.from("application_status_history").insert({
    application_id: params.id,
    from_status: current?.status ?? null,
    to_status: newStatus,
    changed_by: user.email ?? user.id,
    note: note ?? null,
  });

  // TODO: trigger the matching SMS/email notification for newStatus here.

  return NextResponse.json({ ok: true });
}
