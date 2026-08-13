import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about LoanSaathi's mission to make loan applications simple and accessible for every Indian.",
};

export default function AboutPage() {
  return (
    <div className="container-mobile py-10 md:max-w-2xl">
      <h1 className="mb-4">About LoanSaathi</h1>

      <div className="space-y-5 text-sm leading-relaxed text-ink-500">
        <p>
          LoanSaathi was built around a simple idea: applying for a loan in
          India shouldn&apos;t feel like filling out a government form. Too
          many people give up halfway through complicated paperwork, unclear
          eligibility criteria, or applications that were never designed with
          a mobile-first, non-English-fluent user in mind.
        </p>

        <p>
          We set out to fix that. LoanSaathi is an application assistance
          and referral platform — we help you organize your information,
          check indicative eligibility, and connect with lending partners,
          all through a simple mobile-OTP-based flow designed for real
          Indian users on real Indian networks, not a polished demo built
          for a fast office WiFi connection.
        </p>

        <h2 className="pt-2 text-base font-semibold text-ink">What We Do</h2>
        <p>
          We are not a bank or NBFC ourselves. We help you prepare a loan
          application, review it for indicative eligibility, and where
          applicable, refer it to a regulated lending partner. The final
          decision — approval, amount, interest rate, and terms — always
          rests with that lender, never with us.
        </p>

        <h2 className="pt-2 text-base font-semibold text-ink">What We Believe</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Applying for a loan should take minutes, not hours.</li>
          <li>Charges and terms should be shown clearly before you pay anything.</li>
          <li>&quot;No&quot; is a valid, honest outcome — we&apos;d rather tell you clearly than promise something we can&apos;t deliver.</li>
          <li>Your data belongs to you, and we only ask for what we actually need.</li>
        </ul>

        <p>
          If you have questions about how we work, our{" "}
          <a href="/contact" className="text-marigold-700 underline">Contact Us</a> page
          has the details, or you can reach out any time at{" "}
          <a href="mailto:support@loansaathi.online" className="text-marigold-700 underline">support@loansaathi.online</a>.
        </p>
      </div>
    </div>
  );
}
