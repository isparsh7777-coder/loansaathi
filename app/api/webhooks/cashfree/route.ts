import { NextRequest, NextResponse } from "next/server";
import { verifyCashfreeWebhookSignature } from "@/lib/cashfree";

/**
 * Cashfree webhook handler. Do not trust the payload until the signature
 * is verified — see lib/cashfree.ts. This is a stub until real charges
 * are enabled (see CASHFREE_CHARGES_ENABLED in .env.example).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature") ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";

  if (process.env.CASHFREE_CHARGES_ENABLED !== "true") {
    return NextResponse.json({ ok: true, stubMode: true });
  }

  const valid = verifyCashfreeWebhookSignature(rawBody, signature, timestamp);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  // TODO: look up the application by order_id, update payment_status,
  // and move the application into the eligibility-review queue.
  console.log("Cashfree webhook received", payload?.type);

  return NextResponse.json({ ok: true });
}
