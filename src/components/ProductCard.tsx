"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, AlertTriangle, Package, Check, XCircle } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useGarageStore } from "@/store/garageStore";
import { useCompareStore } from "@/store/compareStore";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_COLORS: Record<string, string> = {
  Engine: "bg-brand-500/15 text-brand-400 border-brand-500/30",
  Exterior: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Brakes: "bg-red-500/15 text-red-400 border-red-500/30",
  Electronics: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Suspension: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Transmission: "bg-green-500/15 text-green-400 border-green-500/30",
  Cooling: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Interior: "bg-pink-500/15 text-pink-400 border-pink-500/30",
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-dark-500"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-dark-300">
        {rating.toFixed(1)} ({count})
      </span>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { activeVehicle } = useGarageStore();
  const { items: compareItems, addItem: addCompare, removeItem: removeCompare } = useCompareStore();

  const categoryColor =
    CATEGORY_COLORS[product.category] ||
    "bg-gray-500/15 text-gray-400 border-gray-500/30";

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  // Fitment logic:
  // If activeVehicle is set, check if the brand and model match compatibleModels.
  let fitmentStatus: "unknown" | "fits" | "no-fit" = "unknown";
  if (activeVehicle) {
    const activeStr = `${activeVehicle.brand} ${activeVehicle.model}`.toLowerCase();
    const isCompatible = product.compatibleModels.some((model) =>
      model.toLowerCase().includes(activeStr)
    );
    fitmentStatus = isCompatible ? "fits" : "no-fit";
  }

  return (
    <article className="card card-hover group flex flex-col h-full overflow-hidden transition-all duration-300 relative">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative">
        <div className="relative h-48 w-full bg-dark-700 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`badge border ${categoryColor}`}>
              {product.category}
            </span>
          </div>

          {/* Stock status */}
          {!inStock && (
            <div className="absolute inset-0 bg-dark-900/70 flex items-center justify-center">
              <span className="badge bg-red-900/80 text-red-300 border border-red-500/50 text-sm py-2 px-4">
                Out of Stock
              </span>
            </div>
          )}
          {lowStock && inStock && (
            <div className="absolute bottom-3 right-3">
              <span className="badge bg-orange-900/80 text-orange-300 border border-orange-500/50">
                Only {product.stock} left
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Compare Checkbox */}
      <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
        <label className="flex items-center gap-1.5 bg-dark-900/80 backdrop-blur-md border border-dark-600 rounded-lg px-2 py-1 text-[10px] text-white cursor-pointer hover:bg-dark-850 select-none">
          <input
            type="checkbox"
            checked={!!compareItems.find((item) => item.id === product.id)}
            onChange={() => {
              const isAdded = !!compareItems.find((item) => item.id === product.id);
              if (isAdded) {
                removeCompare(product.id);
              } else {
                addCompare(product);
              }
            }}
            className="w-3 h-3 accent-brand-500 rounded border-dark-600 focus:ring-0 cursor-pointer"
          />
          Compare
        </label>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Part Number */}
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-dark-400" />
          <span className="text-xs text-dark-300 font-mono">
            {product.partNumber}
          </span>
        </div>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-semibold leading-snug text-sm hover:text-brand-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Brand */}
        <p className="text-xs text-dark-300">
          Brand:{" "}
          <span className="text-dark-100 font-medium">{product.brand}</span>
        </p>

        {/* Dynamic Fitment Guarantee Box */}
        {fitmentStatus === "fits" && (
          <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/30 rounded-xl p-2.5 shadow-[0_0_10px_rgba(34,197,94,0.05)]">
            <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-green-400 font-bold">✓ Guaranteed Fit</p>
              <p className="text-[10px] text-green-300 mt-0.5 leading-tight">
                Fits your {activeVehicle?.brand} {activeVehicle?.model}
              </p>
            </div>
          </div>
        )}

        {fitmentStatus === "no-fit" && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-2.5">
            <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-red-400 font-bold">✕ Does Not Fit</p>
              <p className="text-[10px] text-red-300 mt-0.5 leading-tight">
                Not compatible with {activeVehicle?.brand} {activeVehicle?.model}
              </p>
            </div>
          </div>
        )}

        {fitmentStatus === "unknown" && (
          <div className="flex items-start gap-2 bg-dark-700/60 border border-dark-500 rounded-xl p-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-yellow-400 font-semibold">Fits:</p>
              <p className="text-xs text-dark-200 mt-0.5 line-clamp-2">
                {product.compatibleModels.slice(0, 2).join(", ")}
                {product.compatibleModels.length > 2 &&
                  ` +${product.compatibleModels.length - 2} more`}
              </p>
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-dark-400">Incl. GST</p>
          </div>
          <button
            onClick={() => inStock && addItem(product as never)}
            disabled={!inStock}
            className="btn-primary flex-shrink-0 py-2 px-3.5 text-sm disabled:opacity-50"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            {inStock ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </article>
  );
}
