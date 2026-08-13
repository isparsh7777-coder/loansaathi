import { NextRequest, NextResponse } from "next/server";
import { sendOtp } from "@/lib/twoFactor";
import { rateLimit } from "@/lib/rateLimit";
import { checkLock } from "@/lib/otpLockout";
import { OTP_SESSION_COOKIE, type AuthPurpose } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { mobile, purpose } = await req.json();

  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number" }, { status: 400 });
  }
  const validPurposes: AuthPurpose[] = ["signup", "login", "reset"];
  const authPurpose: AuthPurpose = validPurposes.includes(purpose) ? purpose : "login";

  const lock = checkLock(mobile);
  if (lock.locked) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${formatRetry(lock.retryAfterSeconds!)}.` },
      { status: 429 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`otp_send_mobile_${mobile}`, 5, 15 * 60) || !rateLimit(`otp_send_ip_${ip}`, 20, 15 * 60)) {
    return NextResponse.json({ error: "Too many OTP requests. Try again later." }, { status: 429 });
  }

  try {
    const { sessionId, stubMode } = await sendOtp(mobile);

    const res = NextResponse.json({ ok: true, stubMode });
    res.cookies.set(OTP_SESSION_COOKIE, JSON.stringify({ sessionId, mobile, purpose: authPurpose }), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("OTP send failed", err);
    return NextResponse.json({ error: "Could not send OTP right now" }, { status: 500 });
  }
}

function formatRetry(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
}
