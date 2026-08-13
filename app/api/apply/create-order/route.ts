import { NextRequest, NextResponse } from "next/server";
import { createCashfreeOrder } from "@/lib/cashfree";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(`create_order_ip_${ip}`, 20, 15 * 60)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const { applicationId, amount, customerMobile, customerName } = body ?? {};

  if (!applicationId || !amount || !customerMobile) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const order = await createCashfreeOrder({
      applicationId,
      amount,
      customerMobile,
      customerName,
    });

    // TODO: persist order.orderId against the application row in Supabase
    // (payment_status = 'pending') so the webhook can reconcile it later.

    return NextResponse.json(order);
  } catch (err) {
    console.error("Cashfree order creation failed", err);
    return NextResponse.json({ error: "Could not create payment order" }, { status: 500 });
  }
}
