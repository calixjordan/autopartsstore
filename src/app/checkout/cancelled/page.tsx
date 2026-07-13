import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CheckoutCancelledPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-12 h-12 text-red-400" />
      </div>

      <h1 className="text-3xl font-black text-white mb-3">
        Payment Cancelled
      </h1>
      <p className="text-dark-200 mb-8">
        No worries — your cart is still saved. You can complete your purchase
        anytime.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-secondary justify-center py-3 px-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Store
        </Link>
        <button
          onClick={() => window.history.back()}
          className="btn-primary justify-center py-3 px-8"
        >
          <ShoppingBag className="w-4 h-4" />
          Return to Cart
        </button>
      </div>
    </div>
  );
}
