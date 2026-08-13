import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/twoFactor";
import { rateLimit } from "@/lib/rateLimit";
import { OTP_SESSION_COOKIE } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { mobile } = await req.json();

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }

  // Limit both by mobile number and by IP, so one bad actor can't burn
  // through your 2Factor SMS credits.
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`otp_send_mobile_${mobile}`, 5, 15 * 60) || !rateLimit(`otp_send_ip_${ip}`, 20, 15 * 60)) {
    return NextResponse.json({ error: "Too many OTP requests. Try again later." }, { status: 429 });
  }

  try {
    const { sessionId, stubMode } = await sendOtp(mobile);

    const res = NextResponse.json({ ok: true, stubMode });
    // Short-lived cookie tying this browser to the 2Factor session + mobile,
    // so /api/otp/verify knows what to check against without trusting the client.
    res.cookies.set(OTP_SESSION_COOKIE, JSON.stringify({ sessionId, mobile }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("OTP send failed", err);
    return NextResponse.json({ error: "Could not send OTP right now" }, { status: 500 });
  }
}
