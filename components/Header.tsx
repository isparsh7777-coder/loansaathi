import Link from "next/link";
import ProfileMenu from "@/components/ProfileMenu";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/personal-loan", label: "Loans" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/track-application", label: "Track Application" },
  { href: "/help", label: "Help" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight text-ink">
          Loan<span className="text-marigold-700">Saathi</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-500 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden text-sm font-medium text-ink-500 hover:text-ink sm:block"
            aria-label="Switch language"
          >
            हिंदी | English
          </button>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
