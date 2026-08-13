"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const notAuthorized = params.get("error") === "not_authorized";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-center">Admin Login</h1>

      {notAuthorized && (
        <p className="mb-4 rounded-card border border-caution-100 bg-caution-100/40 p-3 text-sm text-caution">
          That account isn&apos;t set up as an admin yet. Contact whoever
          manages the admin_users table.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-card border border-line bg-white px-4 py-3 outline-none"
          />
        </label>
        {error && <p className="text-sm text-caution">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Signing in…" : "SIGN IN"}
        </button>
      </form>
    </div>
  );
}
