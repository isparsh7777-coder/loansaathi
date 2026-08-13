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
  if (!rateLimit(`admin_payment_override_${user.id}`, 60, 60 * 5)) {
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

  const { paymentStatus, note } = await req.json();
  if (!["pending", "paid", "failed", "refunded"].includes(paymentStatus)) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("loan_applications")
    .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: "Could not update payment status" }, { status: 500 });
  }

  // Manual overrides are exactly the kind of thing that needs a paper trail.
  await supabase.from("application_status_history").insert({
    application_id: params.id,
    from_status: null,
    to_status: `payment_manually_set_${paymentStatus}`,
    changed_by: user.email ?? user.id,
    note: note ?? "Manually verified — gateway could not confirm automatically",
  });

  return NextResponse.json({ ok: true });
}
