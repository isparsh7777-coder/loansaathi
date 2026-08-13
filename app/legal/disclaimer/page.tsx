import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Loan Disclaimer" };

export default function DisclaimerPage() {
  return (
    <LegalPage title="Loan Disclaimer" lastUpdated="11 August 2026">
      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">1. We Are an Assistance Platform, Not a Lender</h2>
        <p>
          LoanSaathi is an application assistance/referral platform. Unless
          expressly stated otherwise in writing for a specific product, we
          are not a bank, NBFC, or lender, and we do not ourselves extend
          credit to you. Where applicable, lending services are provided by
          the relevant RBI-regulated bank, NBFC, or other authorized lending
          partner.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">2. No Guarantee of Approval</h2>
        <p>
          Submission of an application, or payment of any applicable
          service/assistance charge, does <strong>not</strong> guarantee loan
          approval or disbursement. Loan availability, approval, amount,
          interest rate, tenure, and other terms are determined solely by
          the applicable lender, based on its own eligibility criteria,
          underwriting, verification, and internal policies — which may
          change at any time without notice to us.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">3. Indicative Information Only</h2>
        <p>
          Any eligibility estimate, indicative loan amount, indicative
          interest rate, or estimated credit score shown on the Platform is
          for general guidance only and does not constitute a loan offer or
          a commitment from us or any lending partner. Only the terms
          confirmed directly by a lender in a formal offer/sanction letter
          are binding.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">4. Review the Lender&apos;s Own Disclosures</h2>
        <p>
          Before accepting any loan offer, carefully review the lender&apos;s
          own Key Facts Statement (KFS), Annual Percentage Rate (APR), fees,
          charges, prepayment terms, and repayment schedule. These documents
          come directly from the lender and take precedence over any
          indicative figures shown on our Platform.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">5. Your Responsibility to Borrow Responsibly</h2>
        <p>
          A loan is a financial obligation. Please borrow only what you can
          reasonably repay, and consider your existing financial commitments
          before applying. We encourage you to compare terms across lenders
          where possible and to ask questions before accepting any offer.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">6. Beware of Fraudulent Impersonation</h2>
        <p>
          We will never ask you to pay a &quot;disbursement fee&quot; after
          approval, or ask for your OTP, PIN, CVV, or net-banking password
          over call, SMS, or WhatsApp. If anyone claiming to represent
          LoanSaathi asks for these, do not share them, and report it to{" "}
          <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>{" "}
          immediately.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">7. Changes to This Disclaimer</h2>
        <p>
          We may update this disclaimer periodically to reflect changes in
          our services or applicable regulation. The &quot;Last
          updated&quot; date above reflects the most recent revision.
        </p>
      </section>
    </LegalPage>
  );
}
