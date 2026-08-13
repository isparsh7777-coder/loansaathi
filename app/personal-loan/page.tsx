import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Personal Loan Online – Check Eligibility & Apply",
  description:
    "Explore personal loan application assistance online. Check eligibility, required information and available loan options through a simple digital process.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "personal",
        title: "Personal Loan",
        intro:
          "Get application assistance for personal loans covering medical expenses, travel, weddings, home renovation and other personal needs.",
        eligibilityPoints: [
          "Indian resident, generally 21–58 years",
          "Salaried or self-employed with regular income",
          "Basic KYC and income information",
        ],
        documentPoints: [
          "PAN card",
          "Aadhaar or other address proof",
          "Recent salary slips or income proof",
          "Bank statements (last 3–6 months)",
        ],
        faqs: [
          { q: "How can I apply for a personal loan?", a: "Tap GET LOAN, verify your mobile number with OTP, and complete the short application form." },
          { q: "Will everyone get a loan?", a: "No. Final approval, amount and terms depend entirely on the applicable lender's assessment." },
          { q: "How long does the process take?", a: "Submitting your application takes a few minutes. Review time varies by lender." },
        ],
      }}
    />
  );
}
