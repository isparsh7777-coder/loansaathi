import Link from "next/link";
import LoanCard from "@/components/LoanCard";
import ScrollGetLoanButton from "@/components/ScrollGetLoanButton";

const LOAN_CARDS = [
  { title: "Personal Loan", description: "For personal expenses and financial needs.", href: "/personal-loan" },
  { title: "Business Loan", description: "Funding assistance for eligible businesses.", href: "/business-loan" },
  { title: "Home Loan", description: "Assistance for home purchase or construction.", href: "/home-loan" },
  { title: "Vehicle Loan", description: "Finance assistance for eligible cars and two-wheelers.", href: "/vehicle-loan" },
  { title: "Education Loan", description: "Financial assistance for eligible education expenses.", href: "/education-loan" },
];

const HOW_IT_WORKS = [
  { n: "01", title: "Apply Online", body: "Tell us about yourself and your loan requirement." },
  { n: "02", title: "Eligibility Review", body: "Your information is reviewed for available loan options, subject to your consent." },
  { n: "03", title: "Application Processing", body: "Our team and authorized partners review your application." },
  { n: "04", title: "Get Notified", body: "If an applicable option is available, you'll be contacted." },
  { n: "05", title: "Lender Decision", body: "The final loan approval is made by the respective lender." },
];

const TRUST_POINTS = [
  "Mobile OTP Login",
  "Simple Application Process",
  "Multiple Loan Categories",
  "Application Tracking",
  "Customer Assistance",
  "Transparent Charges",
  "Secure Payment",
  "No Password Required",
];

export default function HomePage() {
  return (
    <div>
      <ScrollGetLoanButton />
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-mobile py-10 text-center md:max-w-3xl">
          <h1 className="mb-3">Looking for a Loan? Start Your Application Online</h1>
          <p className="mb-6 text-ink-500">
            Get assistance with personal, business, home, vehicle and education loan
            applications through a simple online process.
          </p>
          <Link href="/apply/otp" className="btn-primary mb-3">
            GET LOAN
          </Link>
          <p className="text-xs text-ink-500">
            Mobile OTP · Simple Application · Application Tracking
          </p>
        </div>
      </section>

      {/* Loan categories */}
      <section className="container-mobile py-10 md:max-w-5xl">
        <h2 className="mb-6 text-center">Choose the Loan You Need</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LOAN_CARDS.map((c) => (
            <LoanCard key={c.href} {...c} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-white py-10">
        <div className="container-mobile md:max-w-3xl">
          <h2 className="mb-6 text-center">How Does It Work?</h2>
          <ol className="space-y-5">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.n} className="flex gap-4">
                <span className="font-mono text-sm font-semibold text-marigold-700">
                  {step.n}
                </span>
                <div>
                  <p className="font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-ink-500">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust */}
      <section className="container-mobile py-10 md:max-w-3xl">
        <h2 className="mb-6 text-center">Simple. Transparent. Easy to Use.</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TRUST_POINTS.map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-ink">
              <span className="text-success" aria-hidden>✓</span> {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
