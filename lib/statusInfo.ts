export interface StatusInfo {
  label: string;
  description: string;
  percent: number; // 0-100, drives the animated progress bar
  tone: "neutral" | "progress" | "success" | "caution";
}

export const STATUS_INFO: Record<string, StatusInfo> = {
  submitted: {
    label: "Submitted",
    description: "Your application has been received and is queued for review.",
    percent: 15,
    tone: "neutral",
  },
  under_review: {
    label: "Under Review",
    description: "We're reviewing your application details and checking eligibility.",
    percent: 40,
    tone: "progress",
  },
  more_info_required: {
    label: "More Information Required",
    description: "We need a bit more information from you to continue. We'll be in touch.",
    percent: 45,
    tone: "caution",
  },
  eligible: {
    label: "Eligible",
    description: "Good news — an applicable loan option may be available. Check your options below.",
    percent: 65,
    tone: "success",
  },
  not_eligible: {
    label: "Not Eligible",
    description: "Based on the information provided, no applicable loan option was found at this time.",
    percent: 100,
    tone: "caution",
  },
  referred_to_partner: {
    label: "Referred to Partner",
    description: "Your application has been referred to a lending partner for their assessment.",
    percent: 75,
    tone: "progress",
  },
  lender_decision_pending: {
    label: "Lender Decision Pending",
    description: "The lender is reviewing your application. This can take a few business days.",
    percent: 85,
    tone: "progress",
  },
  approved_by_lender: {
    label: "Approved by Lender",
    description: "The lender has approved your application. Log in to view the offer details.",
    percent: 95,
    tone: "success",
  },
  disbursed: {
    label: "Disbursed",
    description: "Your loan amount has been disbursed by the lender.",
    percent: 100,
    tone: "success",
  },
};
