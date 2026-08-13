import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { rateLimit } from "@/lib/rateLimit";

const CHARGES_ENABLED = process.env.CASHFREE_CHARGES_ENABLED === "true";

export async function POST(req: NextRequest) {
  if (CHARGES_ENABLED) {
    // Real payments must only be confirmed by the Cashfree webhook or the
    // order-status check, never by the browser telling us "trust me".
    return NextResponse.json({ error: "Not available in live payment mode" }, { status: 403 });
  }

  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  if (!rateLimit(`mark_paid_${session.customerId}`, 10, 60 * 60)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const { applicationId } = await req.json();
  const supabase = createServiceRoleClient();

  const { data: app } = await supabase
    .from("loan_applications")
    .select("id, customer_id")
    .eq("id", applicationId)
    .single();

  if (!app || app.customer_id !== session.customerId) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  await supabase
    .from("loan_applications")
    .update({ payment_status: "paid", status: "under_review", updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  await supabase.from("application_status_history").insert({
    application_id: applicationId,
    from_status: "submitted",
    to_status: "under_review",
    changed_by: "system",
    note: "Demo payment confirmed (stub mode)",
  });

  return NextResponse.json({ ok: true });
}
