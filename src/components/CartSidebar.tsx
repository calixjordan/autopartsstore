"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Package } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponAppliedMessage, setCouponAppliedMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeItems = mounted ? items : [];
  const total = mounted ? subtotal() : 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponAppliedMessage("");
    const code = couponInput.toUpperCase().trim();
    if (code === "RAIN15") {
      setActiveCoupon("RAIN15");
      setCouponAppliedMessage("15% Special discount applied!");
    } else if (code === "UPI10") {
      setActiveCoupon("UPI10");
      setCouponAppliedMessage("10% UPI cashback discount applied!");
    } else if (code === "FREESHIP") {
      setActiveCoupon("FREESHIP");
      setCouponAppliedMessage("Free Delivery code applied!");
    } else {
      setCouponError("Invalid coupon code.");
    }
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon("");
    setCouponInput("");
    setCouponError("");
    setCouponAppliedMessage("");
  };

  const handleCheckout = async () => {
    if (activeItems.length === 0) return;
    if (!user) {
      setCheckoutError("🔑 Please sign in to track your order & print tax invoices. Redirecting...");
      setTimeout(() => {
        closeCart();
        router.push("/signin?redirect=/orders");
      }, 1500);
      return;
    }
    setLoading(true);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: activeItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          })),
          userId: user?.id || null,
          couponCode: activeCoupon || null,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Checkout failed. Please try again.");
      }
    } catch {
      setCheckoutError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  let discount = 0;
  if (activeCoupon === "RAIN15") {
    discount = total * 0.15;
  } else if (activeCoupon === "UPI10") {
    discount = total * 0.10;
  }

  const shipping = total > 4999 || activeCoupon === "FREESHIP" ? 0 : (total === 0 ? 0 : 150);
  const grandTotal = total - discount + shipping;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-dark-800 border-l border-dark-600 z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-dark-600">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">Shopping Cart</h2>
            {activeItems.length > 0 && (
              <span className="badge bg-brand-500/20 text-brand-400">
                {activeItems.length} {activeItems.length === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeItems.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 rounded-lg text-dark-300 hover:text-red-400 hover:bg-dark-700 transition-all text-xs flex items-center gap-1"
                title="Clear cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700 transition-all"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center">
                <Package className="w-10 h-10 text-dark-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Your cart is empty</p>
                <p className="text-dark-300 text-sm mt-1">
                  Add some genuine spare parts to get started
                </p>
              </div>
              <button onClick={closeCart} className="btn-primary mt-2">
                Browse Parts
              </button>
            </div>
          ) : (
            activeItems.map((item) => (
              <div
                key={item.product.id}
                className="card p-3 flex gap-3 animate-slide-up"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-dark-700 flex-shrink-0">
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-dark-300 text-xs mt-0.5">
                    PN: {item.product.partNumber}
                  </p>
                  <p className="text-brand-400 font-bold mt-1.5">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-dark-700 rounded-lg p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-dark-500 transition-colors text-dark-200 hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-dark-500 transition-colors text-dark-200 hover:text-white disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-auto p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {activeItems.length > 0 && (
          <div className="border-t border-dark-600 p-5 space-y-4">
            {/* Shipping notice */}
            {total < 4999 && (
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl px-4 py-2.5 text-[10px] text-brand-300">
                🚚 Add ₹{(4999 - total).toLocaleString("en-IN")} more for{" "}
                <strong>FREE shipping</strong>!
              </div>
            )}
            {total >= 4999 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-2.5 text-[10px] text-green-400">
                ✅ You qualify for <strong>FREE shipping</strong>!
              </div>
            )}

            {/* Coupon Code Input */}
            <div className="bg-dark-900 border border-dark-700/60 rounded-xl p-3 space-y-2">
              {activeCoupon ? (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-400 font-bold">🎟️ Coupon {activeCoupon} Applied</span>
                  <button onClick={handleRemoveCoupon} className="text-red-450 hover:text-red-400 font-bold text-[10px] uppercase">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon (RAIN15, FREESHIP)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="bg-dark-800 border border-dark-650 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-dark-400 outline-none flex-1 focus:border-brand-500"
                  />
                  <button type="submit" className="btn-primary text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-red-450 font-semibold">{couponError}</p>}
              {couponAppliedMessage && <p className="text-[10px] text-green-400 font-semibold">{couponAppliedMessage}</p>}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-dark-200">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-dark-200">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-400 font-semibold" : ""}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-dark-600">
                <span>Total</span>
                <span className="text-brand-400">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="bg-red-900/40 border border-red-500/50 rounded-xl p-3.5 text-xs text-red-200 leading-relaxed">
                <div className="flex items-start justify-between gap-2">
                  <span>{checkoutError}</span>
                  <button
                    onClick={() => setCheckoutError(null)}
                    className="text-red-400 hover:text-white flex-shrink-0 font-bold ml-2"
                    aria-label="Dismiss error"
                  >✕</button>
                </div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-dark-400">
              🔒 Secured by Stripe — 256-bit SSL encryption
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
