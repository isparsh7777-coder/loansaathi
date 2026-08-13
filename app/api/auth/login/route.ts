import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password";
import { checkLock, recordFailure, resetFailures } from "@/lib/otpLockout";
import { rateLimit } from "@/lib/rateLimit";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { createCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";

export async function POST(req: NextRequest) {
  const { mobile, password } = await req.json();

  if (!mobile || !/^\d{10}$/.test(mobile) || !password) {
    return NextResponse.json({ error: "Enter your mobile number and password" }, { status: 400 });
  }

  const lockKey = `login_${mobile}`;
  const lock = checkLock(lockKey);
  if (lock.locked) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${formatRetry(lock.retryAfterSeconds!)}.` },
      { status: 429 }
    );
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`login_ip_${ip}`, 30, 15 * 60)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const supabase = createServiceRoleClient();
  const fullMobile = `+91${mobile}`;

  const { data: customer } = await supabase
    .from("customers")
    .select("id, password_hash")
    .eq("mobile_number", fullMobile)
    .maybeSingle();

  if (!customer?.password_hash || !verifyPassword(password, customer.password_hash)) {
    const lockedSeconds = recordFailure(lockKey);
    return NextResponse.json(
      { error: `Incorrect mobile number or password. Repeated failures will lock you out for ${formatRetry(lockedSeconds)}.` },
      { status: 401 }
    );
  }
  resetFailures(lockKey);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_SESSION_COOKIE, createCustomerSession(customer.id, fullMobile), {
    httpOnly: true, secure: true, sameSite: "lax", maxAge: 60 * 60 * 12, path: "/",
  });
  return res;
}

function formatRetry(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.ceil(seconds / 60)}m`;
  return `${Math.ceil(seconds / 3600)}h`;
}
