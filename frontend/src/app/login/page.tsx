"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import Footer from "@/components/dashboard/Footer";
import { loginUser } from "@/lib/api";
import { setStoredToken } from "@/lib/utils";
import { ArrowRight, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      setStoredToken(data.access_token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-surface/60 p-8 sm:p-10 backdrop-blur-xs">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-light tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-xs text-neutral-400 font-light">
              Sign in to access your personalized mortality dashboard.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-400 text-center font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-neutral-800 bg-black py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-mono">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-800 bg-black py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 focus:border-white focus:outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center text-xs text-neutral-400 pt-2">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-white underline hover:text-neutral-300">
              Create one
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
