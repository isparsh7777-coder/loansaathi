import { NextRequest, NextResponse } from "next/server";
import { hashPassword, isPasswordStrongEnough } from "@/lib/password";
import { rateLimit } from "@/lib/rateLimit";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import {
  verifyOtpVerifiedToken, createCustomerSession,
  CUSTOMER_SESSION_COOKIE, OTP_VERIFIED_COOKIE,
} from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const verified = verifyOtpVerifiedToken(req.cookies.get(OTP_VERIFIED_COOKIE)?.value);
  if (!verified || verified.purpose !== "reset") {
    return NextResponse.json({ error: "Please verify your mobile number again" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`reset_pw_${ip}`, 10, 60 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { password } = await req.json();
  const strengthError = isPasswordStrongEnough(password ?? "");
  if (strengthError) {
    return NextResponse.json({ error: strengthError }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const fullMobile = verified.mobile.startsWith("+91") ? verified.mobile : `+91${verified.mobile}`;

  const { data: customer, error } = await supabase
    .from("customers")
    .update({ password_hash: hashPassword(password) })
    .eq("mobile_number", fullMobile)
    .select("id")
    .single();

  if (error || !customer) {
    return NextResponse.json({ error: "No account found for this number" }, { status: 404 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_SESSION_COOKIE, createCustomerSession(customer.id, fullMobile), {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 12, path: "/",
  });
  res.cookies.delete(OTP_VERIFIED_COOKIE);
  return res;
}
