import Link from "next/link";
import { Wrench, Mail, Phone, MapPin, Shield, Truck, RefreshCw } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-600 text-dark-200 mt-20">
      {/* Trust Badges Bar */}
      <div className="border-b border-dark-600 py-8 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Genuine Parts</h4>
                <p className="text-xs text-dark-300 mt-0.5">Sourced directly from OEM manufacturers.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Fast Pan-India Shipping</h4>
                <p className="text-xs text-dark-300 mt-0.5">Dispatched within 24 hours with express delivery.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">7-Day Easy Returns</h4>
                <p className="text-xs text-dark-300 mt-0.5">Hassle-free replacement or refund guarantee.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                Auto<span className="text-brand-400">Parts</span>India
              </span>
            </Link>
            <p className="text-xs text-dark-300 leading-relaxed">
              Your premium destination for 100% genuine OEM spare parts. Serving automotive enthusiasts and mechanics across India with factory-certified components.
            </p>
            {/* Brands we serve */}
            <div className="pt-2">
              <h5 className="text-white text-xs font-bold uppercase tracking-wider mb-2">Brands Supported</h5>
              <div className="flex flex-wrap gap-1.5">
                {["Maruti Suzuki", "Hyundai", "Honda", "Tata", "Mahindra"].map((brand) => (
                  <span key={brand} className="badge bg-dark-700 text-dark-100 text-[10px] py-0.5 px-2 border border-dark-600">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              {[
                { href: "/", label: "Browse Catalog" },
                { href: "/orders", label: "Track Order" },
                { href: "/?category=Engine", label: "Engine Components" },
                { href: "/?category=Exterior", label: "Body & Exterior Parts" },
                { href: "/?category=Brakes", label: "Braking Systems" },
                { href: "/?category=Suspension", label: "Suspension & Steering" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Additional Parts</h4>
            <ul className="space-y-2 text-xs">
              {[
                { href: "/?category=Electronics", label: "Electricals & ECU" },
                { href: "/?category=Transmission", label: "Clutch & Gearbox" },
                { href: "/?category=Cooling", label: "Radiator & Fan Assemblies" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm">Contact Support</h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-300 leading-normal">
                  AutoPartsIndia Logistics Hub, Okhla Industrial Area Phase-III, New Delhi, 110020
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-dark-300">1800-419-OEM-PART (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span className="text-dark-300">support@autopartsindia.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-dark-600 py-6 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-400">
          <p>© {currentYear} AutoPartsIndia. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure payments via Stripe</span>
            <div className="w-6 h-4 bg-brand-500/20 border border-brand-500/40 rounded flex items-center justify-center font-bold text-[9px] text-brand-400">
              VISA
            </div>
            <div className="w-6 h-4 bg-brand-500/20 border border-brand-500/40 rounded flex items-center justify-center font-bold text-[9px] text-brand-400">
              MC
            </div>
            <div className="w-6 h-4 bg-brand-500/20 border border-brand-500/40 rounded flex items-center justify-center font-bold text-[9px] text-brand-400">
              UPI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
