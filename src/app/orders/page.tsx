"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Package, Clipboard, ShoppingBag, Truck, Calendar, MapPin, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl: string;
    partNumber: string;
    brand: string;
  };
}

interface Order {
  id: string;
  status: string;
  total: number;
  currency: string;
  shippingAddress: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STEPPER_STAGES = [
  { label: "Placed", status: "pending" },
  { label: "Processing", status: "paid" },
  { label: "Shipped", status: "shipped" },
  { label: "Delivered", status: "delivered" },
];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const simulateNextStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        let nextStatus = "pending";
        if (o.status === "pending") nextStatus = "paid";
        else if (o.status === "paid") nextStatus = "shipped";
        else if (o.status === "shipped") nextStatus = "delivered";
        else nextStatus = "pending";
        return { ...o, status: nextStatus };
      })
    );
  };

  const handlePrintInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let addressObj = { name: "Valued Customer", line1: "N/A", city: "N/A", state: "N/A", postal_code: "N/A" };
    try {
      if (order.shippingAddress) addressObj = JSON.parse(order.shippingAddress);
    } catch {}

    const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const gstAmount = subtotal * 0.18;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const baseValue = subtotal - gstAmount;

    const itemsRows = order.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; font-size: 11px;">
          <strong>${item.product.name}</strong><br/>
          <span style="color: #666; font-size: 9px;">Part OEM: ${item.product.partNumber}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-size: 11px;">${item.product.brand}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-size: 11px;">₹${item.price.toLocaleString("en-IN")}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-size: 11px;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold; font-size: 11px;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <title>Invoice - #${order.id.slice(-8).toUpperCase()}</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 900; color: #111; }
            .logo span { color: #f97316; }
            .title { text-align: right; }
            .title h1 { margin: 0; font-size: 22px; text-transform: uppercase; color: #111; }
            .details { display: flex; justify-content: space-between; margin-bottom: 30px; gap: 40px; }
            .details div { flex: 1; font-size: 12px; }
            .details h3 { border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; font-size: 13px; text-transform: uppercase; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #f5f5f5; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #ddd; }
            .summary { display: flex; justify-content: flex-end; }
            .summary-table { width: 300px; font-size: 12px; }
            .summary-table td { padding: 5px 10px; }
            .summary-table tr.total { font-weight: bold; font-size: 14px; border-top: 2px solid #f97316; color: #f97316; }
            .footer { border-top: 1px solid #eee; margin-top: 50px; padding-top: 20px; text-align: center; font-size: 10px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Auto<span>Parts</span>INDIA</div>
            <div class="title">
              <h1>Invoice Slip</h1>
              <p style="font-size: 11px; margin: 5px 0 0 0;">Inv No: API-INV-2026-${order.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          
          <div class="details">
            <div>
              <h3>Billed By</h3>
              <strong>AutoPartsINDIA Spares Ltd.</strong><br/>
              Plot No. 44, Udyog Vihar Phase IV<br/>
              Gurugram, Haryana - 122016<br/>
              GSTIN: 06AAAFF8812K1Z9
            </div>
            <div>
              <h3>Shipped To</h3>
              <strong>${addressObj.name || "Customer"}</strong><br/>
              ${addressObj.line1 || ""}<br/>
              ${addressObj.city || ""}, ${addressObj.state || ""} - ${addressObj.postal_code || ""}<br/>
              Payment Mode: Stripe Secure Card (Paid)
            </div>
            <div>
              <h3>Metadata</h3>
              Order Ref: #${order.id.slice(-8).toUpperCase()}<br/>
              Transaction Date: ${dateStr}<br/>
              Status: Paid & Verified
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 40%;">Description</th>
                <th style="width: 15%; text-align: center;">Brand</th>
                <th style="width: 15%; text-align: right;">Unit Price</th>
                <th style="width: 10%; text-align: center;">Qty</th>
                <th style="width: 20%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="summary">
            <table class="summary-table">
              <tr>
                <td>Subtotal Value</td>
                <td style="text-align: right;">₹${subtotal.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>CGST (9% share)</td>
                <td style="text-align: right;">₹${cgst.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>SGST (9% share)</td>
                <td style="text-align: right;">₹${sgst.toLocaleString("en-IN")}</td>
              </tr>
              <tr>
                <td>Shipping Charges</td>
                <td style="text-align: right;">${order.total > 4999 ? "FREE" : "₹150"}</td>
              </tr>
              <tr class="total">
                <td>Grand Total</td>
                <td style="text-align: right;">₹${order.total.toLocaleString("en-IN")}</td>
              </tr>
            </table>
          </div>

          <div class="footer">
            Thank you for shopping with AutoPartsINDIA. This is a computer-generated tax invoice and does not require a physical signature.<br/>
            Need support? Email us at spares-support@autoparts.in or call 1800-419-7575.
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !user) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders?userId=${user.id}`);
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        setOrders(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [mounted, user]);

  if (!mounted) return null;

  // Unauthenticated State
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="bg-dark-850 border border-dark-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 via-orange-500 to-amber-500" />
          <Clipboard className="w-12 h-12 text-dark-400 mx-auto mb-4" />
          <h2 className="text-white font-extrabold text-lg mb-2">Access Your Orders</h2>
          <p className="text-dark-300 text-xs mb-6 leading-relaxed">
            Please sign in with your email address to view purchase history, invoices, and track live deliveries.
          </p>
          <Link
            href="/signin?redirect=/orders"
            className="btn-primary w-full justify-center text-sm font-bold py-3 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Package className="w-7 h-7 text-brand-400" />
          <div>
            <h1 className="text-2xl font-black text-white">Purchase History</h1>
            <p className="text-xs text-dark-400">Track and manage your order shipments</p>
          </div>
        </div>
        <Link href="/" className="btn-secondary text-xs py-2 px-3 self-start sm:self-auto flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          <p className="text-sm text-dark-300">Retrieving order database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-dark-800/40 border border-dark-700/60 rounded-3xl p-16 text-center">
          <ShoppingBag className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-1.5 font-black">No orders found</h2>
          <p className="text-dark-300 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            You haven't placed any orders yet. Add products to your cart and check out via Stripe to see them here!
          </p>
          <Link href="/" className="btn-primary inline-flex justify-center text-xs py-2.5 px-4 font-bold shadow-md">
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const statusIdx = STEPPER_STAGES.findIndex(
              (s) => s.status === order.status || (order.status === "paid" && s.status === "pending")
            );

            // Decode shipping address if any
            let addressObj = null;
            try {
              if (order.shippingAddress) addressObj = JSON.parse(order.shippingAddress);
            } catch {}

            return (
              <article key={order.id} className="bg-dark-850 border border-dark-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:border-dark-600">
                {/* Header Metadata */}
                <div className="bg-dark-900/60 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-700">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <p className="text-dark-400 font-bold uppercase tracking-wider text-[9px]">Order ID</p>
                      <p className="text-white font-mono font-bold mt-1 text-[10px] truncate max-w-[120px]" title={order.id}>
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 font-bold uppercase tracking-wider text-[9px]">Date Placed</p>
                      <p className="text-white font-bold mt-1 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-dark-300" />
                        {dateStr}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 font-bold uppercase tracking-wider text-[9px]">Total Amount</p>
                      <p className="text-brand-400 font-black mt-1">
                        ₹{order.total.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-400 font-bold uppercase tracking-wider text-[9px]">Shipment Status</p>
                      <span className={`inline-block font-extrabold px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider border mt-1 ${
                        order.status === "delivered"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : order.status === "shipped"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {addressObj && (
                    <div className="flex items-start gap-2 max-w-xs text-xs">
                      <MapPin className="w-4 h-4 text-dark-400 flex-shrink-0 mt-0.5" />
                      <div className="text-[10px] text-dark-300 leading-tight">
                        <p className="font-bold text-white">Shipping To:</p>
                        <p className="truncate mt-0.5">{addressObj.name || addressObj.line1}</p>
                        <p className="truncate text-dark-400">{addressObj.city}, {addressObj.postal_code}</p>
                      </div>
                    </div>
                  )}

                  {/* Print Invoice & Simulator Action Buttons */}
                  <div className="flex items-center justify-end flex-wrap gap-2 flex-shrink-0 mt-2 md:mt-0">
                    <button
                      onClick={() => simulateNextStatus(order.id)}
                      className="btn-secondary text-[10px] py-2 px-3.5 uppercase font-bold tracking-wider hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1.5"
                      title="Advance order delivery stage for testing"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Simulate Status
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(order)}
                      className="btn-secondary text-[10px] py-2 px-3.5 uppercase font-bold tracking-wider hover:bg-brand-500 hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      Print Invoice
                    </button>
                  </div>
                </div>

                {/* Progress Stepper Visual Bar */}
                <div className="px-6 py-6 border-b border-dark-700 bg-dark-900/10">
                  <div className="relative flex items-center justify-between w-full max-w-xl mx-auto">
                    {/* Stepper bar back */}
                    <div className="absolute left-0 right-0 h-1 bg-dark-700 -translate-y-1/2 top-1/2 rounded-full" />
                    {/* Stepper active progress fill */}
                    <div
                      className="absolute left-0 h-1 bg-gradient-to-r from-brand-500 to-orange-500 -translate-y-1/2 top-1/2 rounded-full transition-all duration-700"
                      style={{
                        width: `${
                          statusIdx <= 0 ? 0 : (statusIdx / (STEPPER_STAGES.length - 1)) * 100
                        }%`,
                      }}
                    />

                    {STEPPER_STAGES.map((stage, idx) => {
                      const isActive = idx <= statusIdx;
                      const isDelivered = order.status === "delivered" && idx === 3;
                      
                      return (
                        <div key={stage.label} className="relative z-10 flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive
                              ? "bg-dark-900 border-brand-500 text-brand-400 shadow-[0_0_15px_rgba(249,115,22,0.25)]"
                              : "bg-dark-800 border-dark-600 text-dark-400"
                          }`}>
                            {isDelivered ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : stage.status === "shipped" && order.status === "shipped" ? (
                              <Truck className="w-4 h-4 text-brand-400 animate-pulse" />
                            ) : (
                              <span className="text-[10px] font-bold">{idx + 1}</span>
                            )}
                          </div>
                          <span className={`text-[10px] font-bold mt-2 ${
                            isActive ? "text-white" : "text-dark-400"
                          }`}>
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items Listing */}
                <div className="p-6 divide-y divide-dark-750">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-dark-700 border border-dark-600 flex-shrink-0">
                          <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="text-white text-xs font-bold leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-[10px] text-dark-400 mt-1 font-mono">
                            Part Number: {item.product.partNumber} | Brand: {item.product.brand}
                          </p>
                          <p className="text-[10px] text-dark-300 mt-0.5">
                            Quantity: <span className="text-white font-bold">{item.quantity}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-xs font-black">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[9px] text-dark-400 mt-0.5">Per unit</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Loader2({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`animate-spin ${className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
