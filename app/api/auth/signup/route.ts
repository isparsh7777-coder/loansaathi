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
  if (!verified || verified.purpose !== "signup") {
    return NextResponse.json({ error: "Please verify your mobile number again" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`signup_${ip}`, 10, 60 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const { password } = await req.json();
  const strengthError = isPasswordStrongEnough(password ?? "");
  if (strengthError) {
    return NextResponse.json({ error: strengthError }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const fullMobile = verified.mobile.startsWith("+91") ? verified.mobile : `+91${verified.mobile}`;

  const { data: existing } = await supabase
    .from("customers")
    .select("id, password_hash")
    .eq("mobile_number", fullMobile)
    .maybeSingle();

  if (existing?.password_hash) {
    return NextResponse.json({ error: "An account already exists for this number. Please log in." }, { status: 409 });
  }

  const passwordHash = hashPassword(password);

  const { data: customer, error } = await supabase
    .from("customers")
    .upsert({ mobile_number: fullMobile, password_hash: passwordHash }, { onConflict: "mobile_number" })
    .select("id")
    .single();

  if (error || !customer) {
    console.error("Signup failed", error);
    return NextResponse.json({ error: "Could not create your account" }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_SESSION_COOKIE, createCustomerSession(customer.id, fullMobile), {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 12, path: "/",
  });
  res.cookies.delete(OTP_VERIFIED_COOKIE);
  return res;
}
