"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Email + password login ---
  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      // Friendlier error messages
      if (loginError.message.toLowerCase().includes("invalid")) {
        setError("Wrong email or password. Try again.");
      } else if (loginError.message.toLowerCase().includes("confirm")) {
        setError(
          "Please confirm your email first. Check your inbox for the verification link."
        );
      } else {
        setError(loginError.message);
      }
      return;
    }

    // Success — go to dashboard
    router.push("/dashboard");
    router.refresh();
  }

  // --- Google OAuth login ---
  async function handleGoogleLogin() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (oauthError) setError(oauthError.message);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#f5efe6] flex flex-col items-center px-6 py-12">
      {/* Brand */}
      <Link href="/" className="mb-10 flex items-baseline gap-2 group">
        <span className="text-3xl font-black tracking-tight text-[#f5efe6]">
          NEET<span className="text-[#E8550A]">lab</span>
        </span>
        <span className="text-lg text-[#E8550A] group-hover:scale-125 transition-transform">
          ⬡
        </span>
      </Link>

      <div className="max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-[#a8a297] mb-8">
          Log in to continue exploring chemistry in 3D.
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 px-4 rounded-xl bg-[#f5efe6] text-[#0a0a0f] font-medium flex items-center justify-center gap-3 hover:bg-white transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#2a2a35]"></div>
          <span className="text-xs text-[#5a5750] font-mono uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-[#2a2a35]"></div>
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a8a297] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f17] border border-[#2a2a35] text-[#f5efe6] placeholder:text-[#5a5750] focus:outline-none focus:border-[#E8550A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#a8a297] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f17] border border-[#2a2a35] text-[#f5efe6] placeholder:text-[#5a5750] focus:outline-none focus:border-[#E8550A] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 text-sm text-[#FF6B6B]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#E8550A] text-[#0a0a0f] font-semibold hover:bg-[#ff6b1f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {/* Footer links */}
        <p className="mt-6 text-sm text-[#a8a297] text-center">
          New to NEETlab?{" "}
          <Link
            href="/signup"
            className="text-[#E8550A] hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}