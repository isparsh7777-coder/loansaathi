const STEPS = [
  { n: "1", title: "Start Your Application", body: "Tell us what type of loan you need and provide your basic information." },
  { n: "2", title: "Share Your Requirements", body: "Tell us your required loan amount, preferred tenure and relevant financial details." },
  { n: "3", title: "Eligibility Review", body: "Your application is reviewed based on the information and consent provided." },
  { n: "4", title: "Application Processing", body: "Your application may be reviewed or referred to an applicable authorized lending partner." },
  { n: "5", title: "Track Your Application", body: "Use your mobile number and OTP to check your application status anytime." },
  { n: "6", title: "Lender Decision", body: "The final decision on approval, amount, interest rate and terms is made by the applicable lender." },
];

export default function HowItWorksPage() {
  return (
    <div className="container-mobile py-10 md:max-w-2xl">
      <h1 className="mb-6 text-center">How Does It Work?</h1>
      <ol className="space-y-6">
        {STEPS.map((s) => (
          <li key={s.n} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 font-mono text-sm font-semibold text-ink">
              {s.n}
            </span>
            <div>
              <p className="font-semibold text-ink">{s.title}</p>
              <p className="text-sm text-ink-500">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
