import { NextRequest, NextResponse } from "next/server";
import { getCashfreeOrderStatus } from "@/lib/cashfree";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`verify_order_${ip}`, 30, 15 * 60)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const orderId = req.nextUrl.searchParams.get("order_id");
  if (!orderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  try {
    const status = await getCashfreeOrderStatus(orderId);
    // TODO: if status.orderStatus === "PAID", update loan_applications.payment_status
    // to 'paid' in Supabase (idempotently — the webhook may also do this).
    return NextResponse.json(status);
  } catch (err) {
    console.error("Order status lookup failed", err);
    return NextResponse.json({ error: "Could not verify order status" }, { status: 500 });
  }
}
