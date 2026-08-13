import Link from "next/link";

const ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/apply/otp", label: "Apply", icon: "＋" },
  { href: "/track-application", label: "Track", icon: "◎" },
  { href: "/help", label: "Help", icon: "?" },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white sm:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-mobile justify-between px-2 py-2">
        {ITEMS.map((item) => (
          <li key={item.href} className="flex-1">
            <Link
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 text-xs font-medium text-ink-500 hover:text-ink"
            >
              <span aria-hidden className="text-lg leading-none">
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
