import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" lastUpdated="11 August 2026">
      <p>
        These Terms & Conditions (&quot;Terms&quot;) govern your access to and
        use of the website loansaathi.online and all related services
        (together, the &quot;Platform&quot;), operated by LoanSaathi
        (&quot;LoanSaathi&quot;, &quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;). By accessing or using the Platform, you agree to be
        bound by these Terms. If you do not agree, please do not use the
        Platform.
      </p>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">1. Who We Are</h2>
        <p>
          LoanSaathi is an application assistance and referral platform. We
          are not a bank, non-banking financial company (NBFC), or lender
          unless expressly stated otherwise in writing for a specific product.
          We help you prepare and submit loan applications and, where
          applicable, connect you with regulated lending partners such as
          banks and NBFCs. All lending decisions — including approval,
          rejection, loan amount, interest rate, tenure, and other terms —
          are made solely by the applicable lender.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">2. Eligibility to Use the Platform</h2>
        <p>
          You must be at least 18 years old and legally capable of entering
          into a binding contract under the Indian Contract Act, 1872 to use
          the Platform. By using the Platform, you represent that all
          information you provide is true, accurate, current, and complete.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">3. Account and Mobile OTP Login</h2>
        <p>
          Access to certain features requires verifying your mobile number
          via a one-time password (OTP). You are responsible for maintaining
          the confidentiality of access to your registered mobile number and
          for all activity that occurs through your account. Notify us
          immediately if you suspect unauthorized use of your account.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">4. Nature of Our Service</h2>
        <p>Using the Platform, you can:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Submit information relevant to a loan application (personal, employment, financial, and credit-related details);</li>
          <li>Have that information reviewed for indicative eligibility;</li>
          <li>Be referred, where applicable, to one or more regulated lending partners; and</li>
          <li>Track the status of your application.</li>
        </ul>
        <p className="mt-2">
          Submission of an application, or payment of any applicable
          service/assistance charge, does <strong>not</strong> guarantee loan
          approval, a particular loan amount, interest rate, or disbursal.
          Final decisions rest entirely with the applicable lender, based on
          its own underwriting, verification, and internal policies.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">5. Applicable Charges</h2>
        <p>
          We may charge a service/assistance fee for processing and
          reviewing your application, as displayed to you before payment. This
          fee is separate from any charges levied by the lender itself
          (such as processing fees, which the lender will disclose directly).
          See our{" "}
          <a href="/legal/refund-policy" className="text-marigold-700 underline">
            Refund & Cancellation Policy
          </a>{" "}
          for details on when charges are and are not refundable.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">6. Your Responsibilities</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>Provide accurate and complete information at every step of the application;</li>
          <li>Not impersonate any person or misrepresent your identity, income, or other details;</li>
          <li>Not use the Platform for any unlawful purpose, including fraud or identity theft;</li>
          <li>Not attempt to interfere with, disrupt, or gain unauthorized access to the Platform or its systems;</li>
          <li>Comply with all applicable laws while using the Platform.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">7. Lending Partners</h2>
        <p>
          Where we refer your application to a lending partner, that partner&apos;s
          own terms, Key Facts Statement (KFS), Annual Percentage Rate (APR),
          fees, and repayment schedule will apply to any loan you take from
          them. We recommend reviewing these carefully before accepting any
          loan offer. We are not responsible for the lending partner&apos;s
          decisions, conduct, or the terms of any loan agreement between you
          and the lender.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">8. Intellectual Property</h2>
        <p>
          All content on the Platform — including text, graphics, logos, and
          software — is owned by or licensed to LoanSaathi and is protected
          under applicable intellectual property laws. You may not copy,
          reproduce, distribute, or create derivative works from this content
          without our prior written consent.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, LoanSaathi shall not be
          liable for any indirect, incidental, special, or consequential
          damages arising from your use of the Platform, including but not
          limited to loss of profits, data, or opportunity, or any lending
          partner&apos;s decision not to approve your application. Our total
          liability for any claim arising from your use of the Platform shall
          not exceed the amount of any service/assistance fee you paid to us
          in connection with the relevant application.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">10. Suspension and Termination</h2>
        <p>
          We may suspend or terminate your access to the Platform, without
          prior notice, if we reasonably believe you have violated these
          Terms, provided false information, or used the Platform for an
          unlawful purpose.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">11. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Material changes will
          be indicated by updating the &quot;Last updated&quot; date above.
          Continued use of the Platform after changes are posted constitutes
          acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">12. Governing Law and Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of India. Any disputes arising
          from these Terms or your use of the Platform shall be subject to
          the exclusive jurisdiction of the courts at [insert your registered
          business city], India.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">13. Contact Us</h2>
        <p>
          For questions about these Terms, contact us at{" "}
          <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">
            support@loansaathi.online
          </a>.
        </p>
      </section>
    </LegalPage>
  );
}
