import { createHmac, timingSafeEqual } from "crypto";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

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
