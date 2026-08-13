import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Home Loan – Check Eligibility & Apply Online",
  description: "Get assistance with your home loan application for purchase or construction.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "home",
        title: "Home Loan",
        intro: "Application assistance for purchasing or constructing a home, subject to lender eligibility and verification.",
        eligibilityPoints: [
          "Stable income source, salaried or self-employed",
          "Property documents for the intended purchase/construction",
          "Basic credit and income information",
        ],
        documentPoints: [
          "Identity and address proof",
          "Income proof / ITR",
          "Property documents",
          "Bank statements",
        ],
        faqs: [
          { q: "How is home loan EMI decided?", a: "EMI depends on loan amount, tenure and the interest rate set by the approving lender." },
        ],
      }}
    />
  );
}
