import type { Metadata } from "next";
import Link from "next/link";
import LoanCard from "@/components/LoanCard";

export const metadata: Metadata = {
  title: "Get Loan Online – Apply for Personal, Business, Home & Vehicle Loans",
  description:
    "Get loan application assistance online in minutes. Choose your loan type, verify with mobile OTP, and check eligibility for personal, business, home, vehicle and education loans.",
};

const LOAN_CARDS = [
  { title: "Personal Loan", description: "For personal expenses and financial needs.", href: "/personal-loan" },
  { title: "Business Loan", description: "Funding assistance for eligible businesses.", href: "/business-loan" },
  { title: "Home Loan", description: "Assistance for home purchase or construction.", href: "/home-loan" },
  { title: "Vehicle Loan", description: "Finance assistance for eligible cars and two-wheelers.", href: "/vehicle-loan" },
  { title: "Education Loan", description: "Financial assistance for eligible education expenses.", href: "/education-loan" },
  { title: "Instant Loan", description: "Fast-tracked application assistance for urgent needs.", href: "/instant-loan" },
];

export default function GetLoanPage() {
  return (
    <div className="container-mobile py-10 md:max-w-3xl">
      <h1 className="mb-3 text-center">Get Loan Online</h1>
      <p className="mb-6 text-center text-ink-500">
        Pick the loan you need, verify your mobile number, and complete a short
        application. We&apos;ll help review your eligibility and connect you
        with an applicable lending partner.
      </p>
      <Link href="/apply/otp" className="btn-primary mb-8">GET LOAN</Link>

      <div className="grid gap-4 sm:grid-cols-2">
        {LOAN_CARDS.map((c) => (
          <LoanCard key={c.href} {...c} />
        ))}
      </div>
    </div>
  );
}
