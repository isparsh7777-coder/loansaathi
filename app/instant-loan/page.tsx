import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Instant Loan Online – Fast Application, Quick Eligibility Check",
  description:
    "Apply for instant loan assistance online. Fast mobile-OTP application, quick eligibility review, and real-time application tracking.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "personal",
        title: "Instant Loan",
        intro:
          "\"Instant\" here means a fast application process — mobile OTP login, a short form, and quick eligibility review — not a guaranteed same-day disbursal. Actual approval and disbursal timelines depend on the applicable lender.",
        eligibilityPoints: [
          "Indian resident, generally 21–58 years",
          "Salaried or self-employed with regular income",
          "Basic KYC and income information ready to submit",
        ],
        documentPoints: [
          "PAN card",
          "Aadhaar or other address proof",
          "Recent income proof",
          "Bank statements",
        ],
        faqs: [
          { q: "Is the loan really disbursed instantly?", a: "The application process is fast, but actual disbursal timing depends entirely on the lender's verification and approval process." },
          { q: "How fast is the application itself?", a: "Most applicants complete the online form in under 10 minutes." },
        ],
      }}
    />
  );
}
