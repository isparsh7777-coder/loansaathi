import { createHmac, timingSafeEqual } from "crypto";

const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours — auto-logout after this
const OTP_VERIFIED_TTL_SECONDS = 60 * 10; // 10 minutes to complete signup/reset after OTP

function getSecret() {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret) {
    throw new Error("CUSTOMER_SESSION_SECRET is not set");
  }
  return secret;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sign(data: string) {
  return base64url(createHmac("sha256", getSecret()).update(data).digest());
}

export interface CustomerSessionPayload {
  customerId: string;
  mobile: string;
  exp: number; // unix seconds
}

/** Create a compact, tamper-proof session token: base64url(payload).signature */
export function createCustomerSession(customerId: string, mobile: string): string {
  const payload: CustomerSessionPayload = {
    customerId,
    mobile,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const data = base64url(JSON.stringify(payload));
  return `${data}.${sign(data)}`;
}

/** Verify a session token; returns the payload if valid and not expired, else null. */
export function verifyCustomerSession(token: string | undefined | null): CustomerSessionPayload | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = sign(data);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload: CustomerSessionPayload = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export const CUSTOMER_SESSION_COOKIE = "ls_session";
export const OTP_SESSION_COOKIE = "ls_otp_pending";
export const OTP_VERIFIED_COOKIE = "ls_otp_verified";

export type AuthPurpose = "signup" | "login" | "reset";

export interface OtpVerifiedPayload {
  mobile: string;
  purpose: AuthPurpose;
  exp: number;
}

/** Short-lived proof that this mobile number just passed OTP verification,
 * for the given purpose. Used to authorize the next step (set password /
 * reset password) without asking for the OTP a second time. */
export function createOtpVerifiedToken(mobile: string, purpose: AuthPurpose): string {
  const payload: OtpVerifiedPayload = {
    mobile,
    purpose,
    exp: Math.floor(Date.now() / 1000) + OTP_VERIFIED_TTL_SECONDS,
  };
  const data = base64url(JSON.stringify(payload));
  return `${data}.${sign(data)}`;
}

export function verifyOtpVerifiedToken(token: string | undefined | null): OtpVerifiedPayload | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const expected = sign(data);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload: OtpVerifiedPayload = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
