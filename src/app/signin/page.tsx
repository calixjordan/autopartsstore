"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Lock, Mail, User as UserIcon, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Suspense } from "react";

function SignInForm() {
  const { user, signIn, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && user) {
      router.push(redirectTo);
    }
  }, [mounted, user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await signIn(email.trim(), name.trim() || undefined);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 px-4 py-12 relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Title Hub */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black bg-gradient-to-r from-brand-400 via-orange-500 to-amber-400 bg-clip-text text-transparent mb-3">
            AutoPartsIndia
          </Link>
          <h2 className="text-white text-xl font-bold">Sign in to your account</h2>
          <p className="text-dark-300 text-xs mt-1.5">
            Manage your orders, track fitments, and secure fast checkouts.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-850 border border-dark-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500" />
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name input */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-bold text-dark-200">
                Full Name (Optional)
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-500 w-full outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold text-dark-200">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark-900 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-brand-500 w-full outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400 leading-snug">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3.5 rounded-xl font-extrabold text-sm shadow-[0_0_20px_rgba(249,115,22,0.15)] disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Proceed
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure lock notice */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-dark-400 mt-6">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure passwordless email authentication.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-white bg-dark-950">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
