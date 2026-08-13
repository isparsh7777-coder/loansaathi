import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="11 August 2026">
      <p>
        This Privacy Policy explains how LoanSaathi (&quot;we&quot;,
        &quot;us&quot;, &quot;our&quot;) collects, uses, shares, and protects
        your personal information when you use loansaathi.online and related
        services (the &quot;Platform&quot;). It is designed to align with the
        Digital Personal Data Protection Act, 2023 (DPDP Act) and applicable
        RBI guidance on digital lending.
      </p>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">1. Information We Collect</h2>
        <p>We collect only what is reasonably needed to process your loan application:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Identity information:</strong> name, date of birth, PAN, address, and other KYC details.</li>
          <li><strong>Contact information:</strong> mobile number, email address.</li>
          <li><strong>Financial information:</strong> employment type, monthly income, loan amount and purpose requested, existing obligations you disclose.</li>
          <li><strong>Credit information:</strong> with your explicit consent, information relevant to assessing creditworthiness. We do not access or share this without your consent.</li>
          <li><strong>Usage information:</strong> device type, browser, IP address, and pages visited, collected automatically for security and analytics.</li>
          <li><strong>Payment information:</strong> processed directly by our payment gateway partner (Cashfree) — we do not store your card, UPI, or banking credentials on our own servers.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">2. Why We Collect It</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li>To create and manage your application;</li>
          <li>To assess indicative eligibility and, where applicable, refer your application to lending partners;</li>
          <li>To verify your identity and prevent fraud;</li>
          <li>To communicate with you about your application status via SMS, WhatsApp, email, or in-app notification;</li>
          <li>To comply with legal and regulatory obligations; and</li>
          <li>To improve the Platform&apos;s performance, reliability, and security.</li>
        </ul>
        <p className="mt-2">
          We collect data on a need-basis and do not request information
          unrelated to processing your loan application.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">3. Credit Information &amp; Consent</h2>
        <p>
          We will only access or share credit-related information after you
          have given explicit, informed consent at the relevant step of the
          application. You may withdraw consent going forward at any time by
          contacting us, though this may affect our ability to process an
          in-progress application.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">4. Who We Share Data With</h2>
        <ul className="ml-5 list-disc space-y-1">
          <li><strong>Lending partners</strong> (banks/NBFCs) to whom your application is referred, strictly for eligibility assessment and loan processing purposes;</li>
          <li><strong>Service providers</strong> who support our operations, including our database provider (Supabase), payment gateway (Cashfree), SMS/OTP provider, and live-chat provider — each bound by their own data protection obligations;</li>
          <li><strong>Regulators and law enforcement</strong>, where legally required to do so.</li>
        </ul>
        <p className="mt-2">We do not sell your personal data to third parties.</p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">5. Data Retention</h2>
        <p>
          We retain your information for as long as necessary to fulfil the
          purposes described in this policy, and thereafter as required by
          applicable law (including RBI record-keeping requirements for
          digital lending intermediaries). You may request deletion of your
          data, subject to any legal retention obligations that apply.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">6. Data Security</h2>
        <p>We implement reasonable technical and organizational safeguards, including:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Encryption of data in transit (HTTPS) across the entire Platform;</li>
          <li>Row-level access controls in our database, so users and staff can only access data they are authorized to see;</li>
          <li>Restricted, audited access to production systems;</li>
          <li>Rate-limiting and abuse protection on login and OTP systems.</li>
        </ul>
        <p className="mt-2">
          No system can be guaranteed 100% secure, but we take these measures
          seriously and review them on an ongoing basis. If you believe your
          data has been compromised, contact us immediately at{" "}
          <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">7. Your Rights</h2>
        <p>Subject to applicable law, you have the right to:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>Access the personal data we hold about you;</li>
          <li>Request correction of inaccurate data;</li>
          <li>Request deletion of your data (subject to legal retention requirements);</li>
          <li>Withdraw consent for credit information sharing, going forward;</li>
          <li>Lodge a grievance with our Grievance Officer (see below) or the relevant regulatory authority.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">8. Cookies</h2>
        <p>
          We use cookies and similar technologies to keep you securely logged
          in, remember your preferences, and understand how the Platform is
          used. You can control cookies through your browser settings,
          though some Platform features may not function correctly if
          disabled.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">9. Children&apos;s Privacy</h2>
        <p>
          The Platform is not directed at individuals under 18. We do not
          knowingly collect personal data from minors.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">10. Grievance Officer</h2>
        <p>
          In accordance with applicable Indian law, you may direct privacy
          concerns or grievances to:
        </p>
        <p className="mt-1">
          Email: <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-ink">11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically. The &quot;Last
          updated&quot; date above will reflect the most recent revision.
        </p>
      </section>
    </LegalPage>
  );
}
