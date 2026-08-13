import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-bold text-ink">
            LoanSaathi Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-ink-500 hover:text-ink">Dashboard</Link>
            <Link href="/admin/applications" className="text-ink-500 hover:text-ink">Applications</Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="font-semibold text-marigold-700">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
