/**
 * Cashfree order-creation helper.
 *
 * IMPORTANT — read before enabling in production:
 * Charging a borrower a fee before any loan decision is the highest-risk
 * part of this product. Under RBI's digital lending guidelines, LSP-side
 * fees are generally expected to be paid by the regulated entity (bank/NBFC),
 * not the borrower, unless your specific agreement with your lending
 * partner(s) says otherwise. Do NOT flip CHARGES_ENABLED to true until:
 *   1. You have a signed DSA/LSP agreement with a regulated lender that
 *      permits this fee structure, and
 *   2. Legal has reviewed the Refund & Cancellation Policy copy.
 *
 * Until then this module runs in "stub mode": it records an intent in
 * Supabase but never calls the real Cashfree API, so the UI/UX can be
 * built and tested end-to-end without processing real payments.
 */

const CHARGES_ENABLED = process.env.CASHFREE_CHARGES_ENABLED === "true";

export interface CreateOrderInput {
  applicationId: string;
  amount: number; // in INR
  customerMobile: string;
  customerName?: string;
}

export interface CreateOrderResult {
  orderId: string;
  paymentSessionId: string | null;
  stubMode: boolean;
}

export async function createCashfreeOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  if (!CHARGES_ENABLED) {
    // Stub mode: no real charge, no external call.
    return {
      orderId: `stub_${input.applicationId}`,
      paymentSessionId: null,
      stubMode: true,
    };
  }

  const res = await fetch("https://api.cashfree.com/pg/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": process.env.CASHFREE_CLIENT_ID!,
      "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify({
      order_id: `LS_${input.applicationId}_${Date.now()}`,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.applicationId,
        customer_phone: input.customerMobile,
        customer_name: input.customerName ?? "Applicant",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/apply/payment/return?order_id={order_id}`,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Cashfree order creation failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    orderId: data.order_id,
    paymentSessionId: data.payment_session_id,
    stubMode: false,
  };
}

export interface OrderStatusResult {
  orderId: string;
  orderStatus: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED" | "TERMINATION_REQUESTED";
  stubMode: boolean;
}

/**
 * Look up an order's current status directly from Cashfree. Used on the
 * payment-return page as a safety check in addition to the webhook, since
 * the customer's browser redirect isn't itself trustworthy proof of payment.
 */
export async function getCashfreeOrderStatus(orderId: string): Promise<OrderStatusResult> {
  if (!CHARGES_ENABLED) {
    return { orderId, orderStatus: "PAID", stubMode: true };
  }

  const res = await fetch(`https://api.cashfree.com/pg/orders/${orderId}`, {
    headers: {
      "x-client-id": process.env.CASHFREE_CLIENT_ID!,
      "x-client-secret": process.env.CASHFREE_CLIENT_SECRET!,
      "x-api-version": "2023-08-01",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Cashfree order status lookup failed: ${res.status}`);
  }

  const data = await res.json();
  return { orderId, orderStatus: data.order_status, stubMode: false };
}

/**
 * Verify a Cashfree webhook signature before trusting a payment
 * confirmation. Wire this into a /api/webhooks/cashfree route handler.
 * Implement HMAC-SHA256 verification per Cashfree's webhook docs using
 * CASHFREE_WEBHOOK_SECRET once real charges are enabled.
 */
export function verifyCashfreeWebhookSignature(
  _rawBody: string,
  _signatureHeader: string,
  _timestampHeader: string
): boolean {
  if (!CHARGES_ENABLED) return false;
  throw new Error("Implement signature verification before enabling live charges.");
}
