"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight, Truck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <div className="relative w-28 h-28 mx-auto mb-8">
        <div className="w-28 h-28 rounded-full bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center animate-pulse-slow">
          <CheckCircle className="w-14 h-14 text-green-400" />
        </div>
        <div className="absolute -right-1 -bottom-1 w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-white mb-3">Order Confirmed!</h1>
      <p className="text-dark-200 text-lg mb-2">
        Thank you for your purchase. Your genuine Maruti Suzuki parts are on their way!
      </p>
      {mounted && sessionId && (
        <p className="text-dark-400 text-sm font-mono mb-8">
          Order ref: <span className="text-brand-400">{sessionId.slice(-12).toUpperCase()}</span>
        </p>
      )}

      <div className="glass-card p-6 mb-8 text-left space-y-4">
        <h2 className="text-white font-bold text-lg">What happens next?</h2>
        {[
          {
            icon: CheckCircle,
            title: "Order confirmed",
            desc: "You'll receive an email confirmation shortly.",
            done: true,
          },
          {
            icon: Package,
            title: "Parts being packed",
            desc: "Our team is preparing your order for dispatch.",
            done: false,
          },
          {
            icon: Truck,
            title: "Express delivery",
            desc: "Estimated delivery within 2-4 business days.",
            done: false,
          },
        ].map(({ icon: Icon, title, desc, done }) => (
          <div key={title} className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                done
                  ? "bg-green-500/20 text-green-400"
                  : "bg-dark-700 text-dark-400"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p
                className={`font-semibold text-sm ${
                  done ? "text-green-400" : "text-white"
                }`}
              >
                {title}
              </p>
              <p className="text-dark-400 text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary justify-center py-3 px-8">
          Continue Shopping
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link href="/orders" className="btn-secondary justify-center py-3 px-8">
          View My Orders
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96 text-white">
        Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-96 text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
