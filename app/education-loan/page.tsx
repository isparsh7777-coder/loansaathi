import type { Metadata } from "next";
import LoanCategoryPage from "@/components/LoanCategoryPage";

export const metadata: Metadata = {
  title: "Education Loan – Eligibility & Application Assistance",
  description: "Explore education financing options for eligible students and applicants.",
};

export default function Page() {
  return (
    <LoanCategoryPage
      content={{
        loanType: "education",
        title: "Education Loan",
        intro: "Application assistance for financing eligible education expenses in India or abroad.",
        eligibilityPoints: [
          "Admission confirmation for the intended course",
          "Co-applicant/guarantor details, where required",
          "Basic family income information",
        ],
        documentPoints: [
          "Admission letter",
          "Fee structure",
          "Identity and address proof of applicant and co-applicant",
        ],
        faqs: [
          { q: "Is a co-applicant required?", a: "Many education loans require a co-applicant such as a parent or guardian; requirements vary by lender." },
        ],
      }}
    />
  );
}
