import Link from "next/link";
import Script from "next/script";
import LiveChatButton from "@/components/LiveChatButton";

const FAQS = [
  { q: "How can I apply for a loan?", a: "Tap GET LOAN, verify your mobile number with OTP, and complete the short step-by-step application." },
  { q: "How much loan can I get?", a: "This depends on your income, existing obligations and the applicable lender's policies." },
  { q: "How long does the process take?", a: "Submitting an application takes a few minutes. Review and lender decision timelines vary." },
  { q: "What documents may be required?", a: "Typically identity proof, address proof and income proof. Exact documents depend on the loan type and lender." },
  { q: "Will everyone get a loan?", a: "No. Loan approval is not guaranteed and is decided solely by the applicable lender." },
  { q: "How is my credit information used?", a: "With your consent, your credit information may be used to help assess eligibility. See our Privacy Policy for details." },
  { q: "Who approves my loan?", a: "The final approval decision is always made by the applicable lender, not LoanSaathi." },
  { q: "What happens after I apply?", a: "Your application goes through eligibility review, and you'll be notified if an applicable loan option is available." },
];

const TAWK_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
const TAWK_WIDGET_ID = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

export default function HelpPage() {
  return (
    <div className="container-mobile py-10 md:max-w-2xl">
      {TAWK_PROPERTY_ID && TAWK_WIDGET_ID && (
        <Script id="tawkto" strategy="lazyOnload">
          {`
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            (function () {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
      )}

      <h1 className="mb-6 text-center">Need Help?</h1>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <LiveChatButton />
        <a href="mailto:support@loansaathi.online" className="card text-center">
          <p className="font-semibold text-ink">Email Us</p>
        </a>
        <Link href="/track-application" className="card text-center">
          <p className="font-semibold text-ink">Track Application</p>
        </Link>
      </div>

      <h2 className="mb-4">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQS.map((f) => (
          <details key={f.q} className="card group">
            <summary className="cursor-pointer list-none font-semibold text-ink">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-ink-500">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
