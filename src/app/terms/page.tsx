"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Terms & Conditions</h1>
          <p className="text-xs text-dark-400">Last updated: July 10, 2026</p>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-dark-850 border border-dark-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-xs text-dark-200 space-y-6 leading-relaxed">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500" />

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            1. Acceptance of Terms
          </h2>
          <p>
            Welcome to AutoPartsIndia. By accessing this website or purchasing our genuine OEM/OES spare parts, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our storefront.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            2. Customer Account & Responsibilities
          </h2>
          <p>
            When registering via our passwordless email sign-in, you are solely responsible for keeping your email inbox secure. All purchases and account activity initiated through your authenticated email address will be attributed directly to you.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            3. Fitment Compatibility Guarantee
          </h2>
          <p>
            We offer a **100% Fitment Compatibility Guarantee**. If you configure your active car in "My Garage" and order a part flagged as a `✓ Guaranteed Fit`, but it fails to physically fit your vehicle during assembly, you are entitled to a full replacement or refund within 7 days of delivery, subject to validation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            4. Payments & Billing
          </h2>
          <p>
            All checkouts are routed securely through Stripe. By completing checkout, you authorise us to bill your credit card, debit card, or UPI credentials. We do not store financial payment information on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            5. Return Policy
          </h2>
          <p>
            Returns must be filed within 7 days of package delivery. Items must be returned in their original packaging, unused, and with original serials and labels intact. Returns that show signs of damage or wear from mechanical installation will be denied.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-bold text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-400" />
            6. Limitation of Liability
          </h2>
          <p>
            AutoPartsIndia provides parts for general repair. We are not liable for any mechanical failures, vehicle damages, personal injuries, or labor costs incurred during the installation of products purchased from our catalog. Professional mechanic installation is strongly recommended.
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
