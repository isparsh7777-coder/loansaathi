import Link from "next/link";

export interface LoanCategoryContent {
  loanType: string;
  title: string;
  intro: string;
  eligibilityPoints: string[];
  documentPoints: string[];
  faqs: { q: string; a: string }[];
}

export default function LoanCategoryPage({ content }: { content: LoanCategoryContent }) {
  return (
    <div className="container-mobile py-10 md:max-w-3xl">
      <h1 className="mb-3">{content.title}</h1>
      <p className="mb-6 text-ink-500">{content.intro}</p>
      <Link href="/apply/otp" className="btn-primary mb-8">
        GET LOAN
      </Link>

      <section className="mb-8">
        <h2 className="mb-3">Eligibility</h2>
        <ul className="space-y-2">
          {content.eligibilityPoints.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-ink">
              <span className="text-success" aria-hidden>✓</span> {p}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-500">
          Final eligibility, loan amount, interest rate and tenure are determined
          by the applicable lender based on its own policies and verification.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3">Documents That May Be Required</h2>
        <ul className="space-y-2">
          {content.documentPoints.map((p) => (
            <li key={p} className="text-sm text-ink">• {p}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {content.faqs.map((f) => (
            <div key={f.q} className="card">
              <p className="mb-1 font-semibold text-ink">{f.q}</p>
              <p className="text-sm text-ink-500">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
