import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/twoFactor";
import { rateLimit } from "@/lib/rateLimit";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { createCustomerSession, CUSTOMER_SESSION_COOKIE, OTP_SESSION_COOKIE } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();
  const pendingRaw = req.cookies.get(OTP_SESSION_COOKIE)?.value;

  if (!pendingRaw) {
    return NextResponse.json({ error: "OTP session expired. Request a new OTP." }, { status: 400 });
  }
  if (!otp || !/^\d{4,6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter a valid OTP" }, { status: 400 });
  }

  const { sessionId, mobile } = JSON.parse(pendingRaw) as { sessionId: string; mobile: string };

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`otp_verify_${mobile}`, 8, 15 * 60) || !rateLimit(`otp_verify_ip_${ip}`, 30, 15 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  try {
    const ok = await verifyOtp(sessionId, otp);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const fullMobile = `+91${mobile}`;

    const { data: customer, error: upsertError } = await supabase
      .from("customers")
      .upsert({ mobile_number: fullMobile }, { onConflict: "mobile_number" })
      .select("id")
      .single();

    if (upsertError || !customer) {
      throw upsertError ?? new Error("Could not create customer record");
    }

    const sessionToken = createCustomerSession(customer.id, fullMobile);

    const res = NextResponse.json({ ok: true });
    // No maxAge/expires set — this makes it a session cookie that clears
    // when the browser fully closes, not just the tab. Combined with the
    // logout route below for manual sign-out.
    res.cookies.set(CUSTOMER_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
    res.cookies.delete(OTP_SESSION_COOKIE);
    return res;
  } catch (err) {
    console.error("OTP verify failed", err);
    return NextResponse.json({ error: "Could not verify OTP right now" }, { status: 500 });
  }
}
