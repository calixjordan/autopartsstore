import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartSidebar } from "@/components/CartSidebar";
import { CompareDrawer } from "@/components/CompareDrawer";
import { MechanicAssistant } from "@/components/MechanicAssistant";
import { Toaster } from "@/components/ui/Toaster";
import { Footer } from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoPartsIndia — Genuine Premium Car Spare Parts",
  description:
    "Shop 100% genuine OEM spare parts and upgrades for German, Japanese, US, Indian, and Korean car models. Fast delivery across India with fitment guarantee.",
  keywords:
    "car spare parts, genuine OEM parts, car spares India, multi-brand auto parts, automotive parts store, BMW parts, Honda parts, Toyota parts",
  openGraph: {
    title: "AutoPartsIndia — Genuine Premium Car Spare Parts",
    description: "100% genuine OEM spare parts for premium vehicle makes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} bg-dark-900 text-dark-100 overflow-x-hidden min-h-screen relative`}>
        {/* Luxury Background Ambient Glows & Grid Mesh */}
        <div className="fixed inset-0 -z-50 bg-[#0c0b0a] overflow-hidden pointer-events-none select-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-500/5 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-500/5 blur-[150px]" />
          <div className="absolute top-[30%] left-[60%] w-[40%] h-[40%] rounded-full bg-brand-500/3 blur-[100px]" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1b19_1px,transparent_1px),linear-gradient(to_bottom,#1d1b19_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
        </div>

        <Navbar />
        <CartSidebar />
        <CompareDrawer />
        <MechanicAssistant />
        <Toaster />
        <main className="min-h-screen relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
