import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with LoanSaathi for support with your loan application.",
};

export default function ContactPage() {
  return (
    <div className="container-mobile py-10 md:max-w-lg">
      <h1 className="mb-2 text-center">Contact Us</h1>
      <p className="mb-8 text-center text-sm text-ink-500">
        We&apos;re here to help with your application, payments, or general questions.
      </p>

      <div className="space-y-4">
        <a href="mailto:support@loansaathi.online" className="card block text-center">
          <p className="mb-1 text-xs font-semibold uppercase text-ink-500">Email</p>
          <p className="font-semibold text-marigold-700">support@loansaathi.online</p>
        </a>

        <div className="card text-center">
          <p className="mb-1 text-xs font-semibold uppercase text-ink-500">Live Support</p>
          <p className="text-sm text-ink-500">
            Available on our{" "}
            <a href="/help" className="font-semibold text-marigold-700 underline">Help page</a>{" "}
            during business hours.
          </p>
        </div>

        <div className="card text-center">
          <p className="mb-1 text-xs font-semibold uppercase text-ink-500">Registered Address</p>
          <p className="text-sm text-ink-500">
            [Your registered business address], India
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-ink-500">
        For grievances related to your data or privacy, see the Grievance
        Officer section of our{" "}
        <a href="/legal/privacy" className="text-marigold-700 underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
