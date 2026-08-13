import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Business Loan Online – Eligibility, Documents & Application",
  description:
    "Explore financing options for eligible small and growing businesses. Check eligibility and apply online.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "business",
        title: "Business Loan",
        intro:
          "Application assistance for working capital, equipment purchase and business expansion financing for eligible businesses.",
        eligibilityPoints: [
          "Business vintage typically 1+ years",
          "Valid business registration/GST where applicable",
          "Basic business financials",
        ],
        documentPoints: [
          "Business registration proof",
          "GST returns (where applicable)",
          "Bank statements",
          "PAN (business and proprietor/partners)",
        ],
        faqs: [
          { q: "What documents may be required for a business loan?", a: "Registration proof, GST filings and recent bank statements are commonly requested; exact requirements vary by lender." },
          { q: "Who approves my loan?", a: "The applicable lending partner makes the final approval decision, not LoanSaathi." },
        ],
      }}
    />
  );
}
