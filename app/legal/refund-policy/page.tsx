import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" lastUpdated="11 August 2026">
      <p>
        This policy explains what our service/assistance charge covers, when
        you can cancel, and when a refund is or is not applicable. Please
        read this before making a payment.
      </p>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">1. What the Charge Covers</h2>
        <p>
          The service/assistance charge you pay at the application stage
          covers our processing and eligibility-review work: reviewing the
          information you submitted, checking it against available lending
          partner criteria, and (where applicable) referring your application
          to one or more lending partners. It does <strong>not</strong> cover,
          and is entirely separate from, any charges the lender itself may
          apply (such as their own processing fee), which the lender will
          disclose to you directly if they extend a loan offer.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">2. When the Service Is Considered Delivered</h2>
        <p>
          The service is considered delivered once we have completed our
          eligibility review of your submitted application — regardless of
          whether that review results in an eligible outcome, a request for
          more information, or a not-eligible outcome. This is because the
          charge is for the review process itself, not a guaranteed loan
          approval.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">3. Cancellation</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>You may cancel your application before payment is made, free of charge, at any point in the application flow.</li>
          <li>After payment, you may request cancellation before our eligibility review has started by contacting <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>; if review has not yet begun, we will process a full refund.</li>
          <li>Once eligibility review has started, cancellation does not automatically entitle you to a refund — see Section 5.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">4. Refunds — When Applicable</h2>
        <p>A refund of the service/assistance charge will be issued where:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Payment was successfully deducted but your application was not actually created or submitted due to a technical failure on our end (see Section 7);</li>
          <li>You were charged more than once for the same application (duplicate payment — see Section 8);</li>
          <li>You cancelled before our eligibility review began (see Section 3);</li>
          <li>The transaction is confirmed as fraudulent or unauthorized after our investigation (see Section 9).</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">5. Refunds — When Not Applicable</h2>
        <p>A refund will generally <strong>not</strong> be issued where:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Your application was reviewed and found not eligible by us or by a lending partner;</li>
          <li>A lending partner declined to approve, or approved on different terms than you expected;</li>
          <li>You provided inaccurate or incomplete information that affected the outcome;</li>
          <li>You simply changed your mind after the eligibility review had already been completed.</li>
        </ul>
        <p className="mt-2">
          This is because payment covers the review and referral process
          itself, which does not change based on the outcome — this is
          disclosed to you clearly before you pay, on the payment screen.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">6. Payment Failures</h2>
        <p>
          If a payment fails or is left incomplete (for example, you close
          the payment window before it finishes), no charge should be
          deducted. If your bank statement shows a deduction for a payment
          that failed on our end, contact us with your transaction reference
          and we will investigate and refund confirmed failed-but-charged
          transactions within the timelines specified by our payment
          gateway partner (typically 5–7 business days once confirmed).
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">7. Technical Failures</h2>
        <p>
          If a system or technical error on our end causes you to be charged
          without your application actually being created, notify us at{" "}
          <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>{" "}
          with your payment reference. Once verified, we will issue a full
          refund.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">8. Duplicate Payments</h2>
        <p>
          If you are inadvertently charged more than once for the same
          application, the duplicate charge will be refunded in full once
          verified. Contact us with both transaction references.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">9. Fraudulent Transactions</h2>
        <p>
          If you believe a payment was made fraudulently or without your
          authorization, report it to us immediately and also to your bank
          or card issuer. We will cooperate with any investigation and, if
          the transaction is confirmed as unauthorized, will process a
          refund in accordance with our payment gateway partner&apos;s
          dispute-resolution process.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">10. How to Request a Refund</h2>
        <p>
          Email <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>{" "}
          with your Application ID, payment reference/transaction ID, and the
          reason for your request. We aim to acknowledge refund requests
          within 2 business days and resolve them within 7–10 business days
          of approval, subject to our payment gateway partner&apos;s
          processing timelines.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">11. Refund Method</h2>
        <p>
          Approved refunds are credited back to the original payment method
          used, via our payment gateway partner. We do not issue cash
          refunds or refunds to a different account/card than the one used
          for the original payment.
        </p>
      </section>
    </LegalPage>
  );
}
