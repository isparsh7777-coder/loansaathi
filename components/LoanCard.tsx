import Link from "next/link";

export default function LoanCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="card block transition-shadow hover:shadow-lg">
      <h3 className="mb-1">{title}</h3>
      <p className="mb-3 text-sm text-ink-500">{description}</p>
      <span className="text-sm font-semibold text-marigold-700">
        Explore {title} →
      </span>
    </Link>
  );
}
