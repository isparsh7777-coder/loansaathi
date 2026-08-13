const TWO_FACTOR_ENABLED = !!process.env.TWO_FACTOR_API_KEY;

export interface SendOtpResult {
  sessionId: string;
  stubMode: boolean;
}

/**
 * Send an OTP via 2Factor's AUTOGEN endpoint. In stub mode (no API key
 * configured yet), returns a fake session and accepts "123456" as the
 * OTP in verifyOtp below — safe for building/testing the UI before your
 * 2Factor key is added.
 */
export async function sendOtp(mobile10Digit: string): Promise<SendOtpResult> {
  if (!TWO_FACTOR_ENABLED) {
    return { sessionId: `stub_${mobile10Digit}_${Date.now()}`, stubMode: true };
  }

  const apiKey = process.env.TWO_FACTOR_API_KEY!;
  const res = await fetch(
    `https://2factor.in/API/V1/${apiKey}/SMS/${mobile10Digit}/AUTOGEN`
  );
  const data = await res.json();

  if (data.Status !== "Success") {
    throw new Error(data.Details || "Could not send OTP");
  }

  return { sessionId: data.Details, stubMode: false };
}

/**
 * Verify an OTP via 2Factor's VERIFY endpoint. In stub mode, "123456"
 * always succeeds (for local/demo testing only).
 */
export async function verifyOtp(sessionId: string, otp: string): Promise<boolean> {
  if (sessionId.startsWith("stub_")) {
    return otp === "123456";
  }

  const apiKey = process.env.TWO_FACTOR_API_KEY!;
  const res = await fetch(
    `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`
  );
  const data = await res.json();
  return data.Status === "Success";
}
