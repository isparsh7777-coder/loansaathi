import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/twoFactor";
import { rateLimit } from "@/lib/rateLimit";
import { checkLock, recordFailure, resetFailures } from "@/lib/otpLockout";
import { OTP_SESSION_COOKIE, OTP_VERIFIED_COOKIE, createOtpVerifiedToken, type AuthPurpose } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();
  const pendingRaw = req.cookies.get(OTP_SESSION_COOKIE)?.value;

  if (!pendingRaw) {
    return NextResponse.json({ error: "OTP session expired. Request a new OTP." }, { status: 400 });
  }
  if (!otp || !/^\d{4,6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter a valid OTP" }, { status: 400 });
  }

  const { sessionId, mobile, purpose } = JSON.parse(pendingRaw) as {
    sessionId: string; mobile: string; purpose: AuthPurpose;
  };

  const lock = checkLock(mobile);
  if (lock.locked) {
    return NextResponse.json(
      { error: `Too many wrong attempts. Try again in ${formatRetry(lock.retryAfterSeconds!)}.` },
      { status: 429 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`otp_verify_ip_${ip}`, 30, 15 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  try {
    const ok = await verifyOtp(sessionId, otp);
    if (!ok) {
      const lockedSeconds = recordFailure(mobile);
      return NextResponse.json(
        { error: `Incorrect OTP. Too many wrong attempts will lock you out for ${formatRetry(lockedSeconds)}.` },
        { status: 401 }
      );
    }
    resetFailures(mobile);

    const res = NextResponse.json({ ok: true, mobile, purpose });
    res.cookies.set(OTP_VERIFIED_COOKIE, createOtpVerifiedToken(mobile, purpose), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 10 * 60,
      path: "/",
    });
    res.cookies.delete(OTP_SESSION_COOKIE);
    return res;
  } catch (err) {
    console.error("OTP verify failed", err);
    return NextResponse.json({ error: "Could not verify OTP right now" }, { status: 500 });
  }
}

function formatRetry(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
}
