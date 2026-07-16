"use client";

import Link from "next/link";
import { ShoppingCart, Wrench, Search, Menu, X, Package, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GarageSelector } from "@/components/GarageSelector";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const { totalItems, toggleCart } = useCartStore();
  const { items: wishlistItems, toggleWishlist } = useWishlistStore();
  const { user, signOut } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const router = useRouter();

  const offers = [
    "🔥 MONSOON SALE: Flat 15% OFF on Brake Pads & Suspension Kits! Code: RAIN15",
    "⚡ FREE EXPRESS SHIPPING on all orders above ₹4,999!",
    "🛠️ Fitment Guarantee: Get 100% Refund if a part doesn't fit your registered car!",
    "💳 Extra 10% Cashback on UPI payments above ₹9,999!"
  ];

  // Wait for client hydration before reading persisted cart state
  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % offers.length);
    }, 4000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  const count = mounted ? totalItems() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled 
          ? "bg-dark-900/90 backdrop-blur-xl border-b border-brand-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
          : "bg-dark-950/60 backdrop-blur-md border-b border-dark-700"
      }`}
    >
      {/* Top Dynamic Offers Banner */}
      <div className="w-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 py-1.5 px-4 text-center overflow-hidden border-b border-brand-500/10 flex items-center justify-center min-h-[30px]">
        <div 
          key={activeOfferIndex} 
          className="text-white text-[10px] font-extrabold tracking-wide uppercase flex items-center gap-1.5 animate-slide-up"
        >
          {offers[activeOfferIndex]}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4 py-3">
          
          {/* Logo & Brand - Premium Gradient Glow */}
          <Link href="/?reset=true" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 via-brand-600 to-brand-500 flex items-center justify-center shadow-[0_0_15px_rgba(197,157,63,0.3)] group-hover:shadow-[0_0_25px_rgba(197,157,63,0.6)] group-hover:rotate-12 transition-all duration-500">
              <Wrench className="w-5 h-5 text-white animate-pulse-slow" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight block">
              Auto<span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-200 bg-clip-text text-transparent">Parts</span><span className="text-dark-300 font-light text-sm ml-1 border-l border-dark-600 pl-2">INDIA</span>
            </span>
          </Link>

          {/* Interactive Dynamic Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-brand-600/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-500" />
            <div className="relative flex w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 shadow-[0_0_8px_rgba(197,157,63,0.3)]">
                <Wrench className="w-3.5 h-3.5 text-white pointer-events-none" />
              </div>
              <input
                type="search"
                placeholder="Search global parts, OEM numbers, car brands..."
                className="w-full bg-dark-800/80 hover:bg-dark-800 text-white placeholder-dark-400 pl-12 pr-4 py-3 rounded-xl border border-dark-600 focus:border-brand-500 focus:bg-dark-900 focus:outline-none focus:ring-1 focus:ring-brand-500/50 shadow-inner transition-all duration-300 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Navigation Links with capsule styling */}
          <nav className="hidden md:flex items-center gap-1.5 bg-dark-800/40 p-1 rounded-xl border border-dark-700/80">
            <Link
              href="/orders"
              className="relative px-4 py-2 rounded-lg text-xs font-semibold text-dark-200 hover:text-white hover:bg-dark-700/80 transition-all duration-300"
            >
              My Orders
            </Link>
          </nav>

          {/* Action Area (Cart & Mobile Toggle) */}
          <div className="flex items-center gap-2">
            <GarageSelector />
            
            {/* User Profile / Sign In Link */}
            {mounted && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/orders"
                  className="hidden sm:flex flex-col text-right justify-center group"
                >
                  <p className="text-[9px] text-dark-400 group-hover:text-white transition-colors leading-none font-bold">Hello,</p>
                  <p className="text-[10px] text-brand-400 group-hover:text-brand-300 font-black max-w-[80px] truncate leading-tight mt-0.5">{user.name || user.email.split("@")[0]}</p>
                </Link>
                <button
                  onClick={signOut}
                  className="px-2.5 py-1.5 rounded-lg border border-dark-600 hover:border-red-500/50 hover:bg-red-500/10 text-dark-300 hover:text-red-400 text-[10px] font-extrabold transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="px-3 py-2 rounded-xl bg-dark-800 border border-dark-600 hover:border-brand-500/60 text-xs text-white hover:text-brand-400 font-extrabold transition-all flex items-center gap-1"
              >
                Sign In
              </Link>
            )}

            {/* Interactive Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className="relative p-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-brand-500/60 shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group"
              aria-label="Open wishlist"
            >
              <Heart className={`w-5 h-5 text-dark-200 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300 ${wishlistCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {wishlistCount > 0 && (
                <div className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white ring-2 ring-dark-900 shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                  {wishlistCount}
                </div>
              )}
            </button>

            {/* Premium Interactive Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 hover:border-brand-500/60 shadow-lg hover:shadow-brand-500/5 transition-all duration-300 group"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="w-5 h-5 text-dark-200 group-hover:text-brand-400 group-hover:scale-110 transition-all duration-300" />
              {count > 0 && (
                <div className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-orange-600 px-1 text-[10px] font-black text-white ring-2 ring-dark-900 shadow-[0_0_10px_rgba(249,115,22,0.6)] animate-bounce">
                  {count > 9 ? "9+" : count}
                </div>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-3 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-600 text-dark-300 hover:text-white transition-all duration-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu - Dropdown */}
        {mobileOpen && (
          <div className="md:hidden pb-5 pt-2 animate-fade-in border-t border-dark-700 mt-2 space-y-3">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search global parts..."
                className="w-full bg-dark-850 text-white placeholder-dark-400 pl-11 pr-4 py-3 rounded-xl border border-dark-600 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/orders"
                className="px-4 py-3 rounded-xl text-sm font-semibold text-dark-200 hover:text-white hover:bg-dark-700 transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                My Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
