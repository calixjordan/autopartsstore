"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Eye, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-dark-400">Last updated: July 10, 2026</p>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-dark-850 border border-dark-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-xs text-dark-200 space-y-6 leading-relaxed">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500" />

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-brand-400" />
            1. Information We Collect
          </h2>
          <p>
            We collect basic account identifiers such as your **email address** and **full name** when you sign in, as well as billing/shipping addresses entered during Stripe checkout sessions. We also store details of your saved vehicles in your local browser session to calculate compatibility checks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-400" />
            2. Secure Payment Gateways
          </h2>
          <p>
            Your payment transactions are processed entirely through **Stripe**. We pass order totals and product lists to Stripe securely via SSL encryption. We do not inspect, log, or store credit card details or bank account credentials on our systems.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-brand-400" />
            3. How We Use Information
          </h2>
          <p>
            We use your contact identifiers to process orders, verify fitment, dispatch shipments, send automated confirmation receipts, and manage order tracking histories. We will never sell, trade, or distribute your email address or contact details to third-party ad networks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-400" />
            4. Local Storage & Cookies
          </h2>
          <p>
            We use browser LocalStorage to persist your shopping cart configuration, saved garage vehicle list, and active login sessions. These cookies are essential for maintaining correct system functionality and preventing hydration discrepancies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-brand-400" />
            5. Security Policies
          </h2>
          <p>
            We implement multiple industry-standard security protocols to keep your information safe. Database transactions are isolated and communications are run over secure HTTPS.
          </p>
        </section>
      </div>

      {/* Back button */}
      <div className="mt-8 text-center">
        <Link href="/" className="btn-secondary inline-flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
      </div>
    </div>
  );
}
