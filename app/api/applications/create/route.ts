import { NextRequest, NextResponse } from "next/server";
import { verifyCustomerSession, CUSTOMER_SESSION_COOKIE } from "@/lib/customerAuth";
import { createServiceRoleClient } from "@/lib/supabase/serviceRole";
import { rateLimit } from "@/lib/rateLimit";

function generateApplicationId() {
  const d = new Date();
  const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `LS-${datePart}-${randomPart}`;
}

export async function POST(req: NextRequest) {
  const session = verifyCustomerSession(req.cookies.get(CUSTOMER_SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "Please verify your mobile number first" }, { status: 401 });
  }

  if (!rateLimit(`app_create_${session.customerId}`, 10, 60 * 60)) {
    return NextResponse.json({ error: "Too many applications submitted. Try again later." }, { status: 429 });
  }

  const body = await req.json();
  const {
    loanType, amount, tenureYears, employmentType, monthlyIncome,
    purpose, creditConsent, firstName, surname, dob, pan, aadhaar,
    houseNo, area, addressLine1, addressLine2, city, pincode,
  } = body;

  if (!loanType || !amount || !tenureYears) {
    return NextResponse.json({ error: "Missing required application details" }, { status: 400 });
  }
  if (amount < 5000 || amount > 5000000) {
    return NextResponse.json({ error: "Loan amount must be between ₹5,000 and ₹50,00,000" }, { status: 400 });
  }
  if (!firstName || firstName.trim().length < 3 || firstName.trim().length > 10) {
    return NextResponse.json({ error: "Name must be 3–10 letters" }, { status: 400 });
  }
  if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(pan).toUpperCase())) {
    return NextResponse.json({ error: "Invalid PAN format" }, { status: 400 });
  }
  if (aadhaar && !/^\d{12}$/.test(String(aadhaar).replace(/\s/g, ""))) {
    return NextResponse.json({ error: "Aadhaar must be exactly 12 digits" }, { status: 400 });
  }
  if (pincode && !/^[1-9][0-9]{5}$/.test(String(pincode))) {
    return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
  }
  if (monthlyIncome != null && (monthlyIncome < 10000 || String(monthlyIncome).length > 8)) {
    return NextResponse.json({ error: "Monthly income must be at least ₹10,000" }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const id = generateApplicationId();

  // Keep customer profile details in sync too (best-effort — doesn't block the application).
  await supabase
    .from("customers")
    .update({
      full_name: surname ? `${firstName} ${surname}` : firstName,
      address: [houseNo, area, addressLine1, addressLine2, city, pincode].filter(Boolean).join(", "),
    })
    .eq("id", session.customerId);

  const { error } = await supabase.from("loan_applications").insert({
    id,
    customer_id: session.customerId,
    loan_type: loanType,
    requested_amount: amount,
    tenure_years: tenureYears,
    employment_type: employmentType,
    monthly_income: monthlyIncome,
    purpose,
    credit_consent_given: !!creditConsent,
    credit_consent_at: creditConsent ? new Date().toISOString() : null,
    status: "submitted",
    payment_status: "pending",
  });

  if (error) {
    console.error("Application creation failed", error);
    return NextResponse.json({ error: "Could not create application" }, { status: 500 });
  }

  await supabase.from("application_status_history").insert({
    application_id: id,
    from_status: null,
    to_status: "submitted",
    changed_by: "system",
    note: "Application created",
  });

  return NextResponse.json({ ok: true, applicationId: id, mobile: session.mobile });
}
