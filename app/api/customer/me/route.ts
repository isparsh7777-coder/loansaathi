import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`customer_me_${ip}`, 60, 60)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const { data: applications, error } = await supabase
    .from("loan_applications")
    .select("*")
    .eq("customer_id", session.customerId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not load applications" }, { status: 500 });
  }

  return NextResponse.json({ mobile: session.mobile, applications });
}
