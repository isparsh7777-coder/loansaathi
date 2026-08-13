import Link from "next/link";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Loan",
    links: [
      { href: "/get-loan", label: "Get Loan" },
      { href: "/instant-loan", label: "Instant Loan" },
      { href: "/personal-loan", label: "Personal Loan" },
      { href: "/business-loan", label: "Business Loan" },
      { href: "/home-loan", label: "Home Loan" },
      { href: "/vehicle-loan", label: "Vehicle Loan" },
      { href: "/education-loan", label: "Education Loan" },
      { href: "/loan-eligibility", label: "Loan Eligibility" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal/terms", label: "Terms & Conditions" },
      { href: "/legal/privacy", label: "Privacy Policy" },
      { href: "/legal/refund-policy", label: "Refund & Cancellation Policy" },
      { href: "/legal/disclaimer", label: "Loan Disclaimer" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-white pb-24 sm:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="card mb-10 border-caution-100 bg-caution-100/40">
          <h3 className="mb-2">Important Information</h3>
          <p className="mb-3 text-sm text-ink-500">
            LoanSaathi is an application assistance/referral platform and is
            not itself a bank or lender unless expressly stated otherwise.
            Loan availability, approval, interest rate, loan amount, tenure
            and other terms are subject to the eligibility criteria,
            verification and policies of the applicable lender. Submission
            of an application or payment of any applicable service/assistance
            charge does not guarantee loan approval or disbursement.
          </p>
          <p className="text-sm text-ink-500">
            Where applicable, lending services are provided by the relevant
            RBI-regulated bank/NBFC or other authorized lending partner.
            Please review the applicable lender&apos;s terms, Key Facts
            Statement (KFS), Annual Percentage Rate (APR), fees and
            repayment schedule before accepting a loan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-3 text-lg font-bold text-ink">LoanSaathi</p>
            <p className="text-sm text-ink-500">
              Simple loan assistance for every Indian.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold text-ink">
                {col.title}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-500 hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 text-xs text-ink-500">
          © 2026 LoanSaathi. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
