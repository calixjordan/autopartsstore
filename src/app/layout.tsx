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
  title: "AutoPartsIndia — Genuine Maruti Suzuki Spare Parts",
  description:
    "Shop 100% genuine OEM spare parts for Maruti Suzuki vehicles. Swift, Baleno, Alto, Dzire, Wagon R, Ertiga and more. Fast delivery across India.",
  keywords:
    "Maruti Suzuki spare parts, genuine OEM parts, Swift parts, Baleno parts, Alto parts, Dzire parts, automotive spare parts India",
  openGraph: {
    title: "AutoPartsIndia — Genuine Maruti Suzuki Spare Parts",
    description: "100% genuine OEM spare parts for Maruti Suzuki vehicles.",
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
