import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartSidebar } from "@/components/CartSidebar";
import { CompareDrawer } from "@/components/CompareDrawer";
import { MechanicAssistant } from "@/components/MechanicAssistant";
import { Toaster } from "@/components/ui/Toaster";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Navbar />
        <CartSidebar />
        <CompareDrawer />
        <MechanicAssistant />
        <Toaster />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
