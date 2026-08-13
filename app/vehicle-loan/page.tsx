import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Vehicle Loan – Car & Two-Wheeler Loan Assistance",
  description: "Explore car and two-wheeler financing options for eligible applicants.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "vehicle",
        title: "Vehicle Loan",
        intro: "Application assistance for financing eligible cars and two-wheelers.",
        eligibilityPoints: [
          "Valid driving license (where required)",
          "Stable income source",
          "Quotation/details of the vehicle to be financed",
        ],
        documentPoints: [
          "Identity and address proof",
          "Income proof",
          "Vehicle quotation",
        ],
        faqs: [
          { q: "Can I finance a two-wheeler?", a: "Yes, two-wheeler financing assistance is available subject to lender eligibility." },
        ],
      }}
    />
  );
}
