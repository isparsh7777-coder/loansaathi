export type LoanType =
  | "personal"
  | "business"
  | "home"
  | "vehicle"
  | "education";

export type EmploymentType =
  | "salaried"
  | "self_employed"
  | "business_owner"
  | "professional"
  | "other";

export type ApplicationStatus =
  | "submitted"
  | "under_review"
  | "more_info_required"
  | "eligible"
  | "not_eligible"
  | "referred_to_partner"
  | "lender_decision_pending"
  | "approved_by_lender"
  | "disbursed";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface LoanApplication {
  id: string; // e.g. LS-20260810-XXXX
  customer_id: string;
  loan_type: LoanType;
  requested_amount: number;
  tenure_years: number;
  employment_type: EmploymentType | null;
  monthly_income: number | null;
  purpose: string | null;
  credit_consent_given: boolean;
  status: ApplicationStatus;
  payment_status: PaymentStatus;
  service_charge_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  mobile_number: string; // stored, never displayed in full in logs
  full_name: string | null;
  email: string | null;
  address: string | null;
  preferred_language: "en" | "hi";
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  partner_type: "bank" | "nbfc" | "dsa" | "other";
  loan_types: LoanType[];
  min_amount: number;
  max_amount: number;
  min_tenure_years: number;
  max_tenure_years: number;
  indicative_apr_min: number | null;
  indicative_apr_max: number | null;
  is_active: boolean;
}

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  personal: "Personal Loan",
  business: "Business Loan",
  home: "Home Loan",
  vehicle: "Vehicle Loan",
  education: "Education Loan",
};
