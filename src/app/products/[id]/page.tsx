"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingCart,
  Star,
  AlertTriangle,
  Package,
  ArrowLeft,
  Check,
  Shield,
  Truck,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

const CATEGORY_COLORS: Record<string, string> = {
  Engine: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Exterior: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Brakes: "bg-red-500/15 text-red-400 border-red-500/30",
  Electronics: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Suspension: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Transmission: "bg-green-500/15 text-green-400 border-green-500/30",
  Cooling: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem } = useCartStore();

  // Reviews list state
  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-1",
      name: "Ramanathan Iyer",
      rating: 5,
      comment: "Extremely reliable part. Sourced directly from certified manufacture line. Package arrived in original bubble wrap and hologram seals. Highly recommended!",
      date: "May 12, 2026",
      verified: true
    },
    {
      id: "rev-2",
      name: "Sandeep Gill",
      rating: 4,
      comment: "Excellent value compared to dealership quotes. Installation was simple, fits perfectly on my vehicle.",
      date: "June 3, 2026",
      verified: true
    },
    {
      id: "rev-3",
      name: "Karan Johar",
      rating: 5,
      comment: "Spares fitment checker verified compatibility. Tested under high load on highway runs, performs exceptionally.",
      date: "June 25, 2026",
      verified: false
    }
  ]);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;
    const newReview = {
      id: Math.random().toString(36).substring(7),
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-IN", { year: 'numeric', month: 'long', day: 'numeric' }),
      verified: false
    };
    setReviewsList([newReview, ...reviewsList]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product as never);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <Package className="w-16 h-16 text-dark-400 mx-auto mb-4" />
        <p className="text-white text-xl font-bold">{error || "Product not found"}</p>
        <button onClick={() => router.push("/")} className="btn-primary mt-6">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </button>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const categoryColor =
    CATEGORY_COLORS[product.category] ||
    "bg-gray-500/15 text-gray-400 border-gray-500/30";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-dark-400 mb-8">
        <button
          onClick={() => router.push("/")}
          className="hover:text-brand-400 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Store
        </button>
        <span>/</span>
        <span className="text-dark-300">{product.category}</span>
        <span>/</span>
        <span className="text-white font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-dark-700 border border-dark-600">
            <div className={`relative w-full h-full transition-all duration-500 ${
              activeImageIndex === 1 ? "scale-x-[-1]" : 
              activeImageIndex === 2 ? "invert hue-rotate-[190deg] brightness-75 contrast-125" : ""
            }`}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            
            {activeImageIndex === 3 && (
              <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-[1px] flex items-center justify-center p-6 text-center animate-fade-in">
                <div className="bg-dark-900/90 border border-brand-500/30 rounded-2xl p-4 max-w-[200px] shadow-2xl flex flex-col items-center gap-2">
                  <Shield className="w-8 h-8 text-brand-400 animate-pulse" />
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">OEM Genuine Sealed</p>
                  <p className="text-[8px] text-dark-400 leading-normal">This part is packaged in original factory-sealed anti-static wrapping with holographic QC seal labels.</p>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4">
              <span className={`badge border ${categoryColor} text-sm py-1.5 px-3`}>
                {product.category}
              </span>
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { label: "Front Angle", style: "" },
              { label: "Rear Profile", style: "scale-x-[-1]" },
              { label: "OEM Schematic", style: "invert hue-rotate-[190deg] brightness-75 contrast-125" },
              { label: "Box Sealed", overlay: true }
            ].map((variant, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-dark-800 border transition-all duration-300 ${
                    isActive ? "border-brand-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : "border-dark-700 hover:border-dark-500"
                  }`}
                >
                  <div className={`relative w-full h-full ${variant.style || ""}`}>
                    <Image
                      src={product.imageUrl}
                      alt={`${product.name} - ${variant.label}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                  {/* Overlay stamp if package */}
                  {variant.overlay && (
                    <div className="absolute inset-0 bg-brand-500/10 flex items-center justify-center">
                      <span className="text-[8px] font-black bg-brand-500 text-white px-1 py-0.5 rounded uppercase leading-none scale-75">
                        OEM
                      </span>
                    </div>
                  )}
                  {/* Hover label */}
                  <div className="absolute bottom-0 left-0 right-0 bg-dark-950/80 py-0.5 text-center text-[7px] font-bold text-dark-300 truncate">
                    {variant.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Shield, label: "OEM Genuine", sub: "Factory certified" },
              { icon: Truck, label: "Pan India", sub: "Fast delivery" },
              { icon: RefreshCw, label: "Easy Returns", sub: "7-day policy" },
            ].map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="card p-3 flex flex-col items-center text-center gap-1.5"
              >
                <Icon className="w-5 h-5 text-brand-400" />
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-dark-400 text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {/* Part number */}
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-dark-400" />
              <code className="text-sm text-brand-400 font-mono bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                {product.partNumber}
              </code>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-dark-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-dark-400 text-sm">
                ({product.reviewCount} verified reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <p className="text-dark-400 text-sm mb-1">incl. 18% GST</p>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {inStock ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span
                  className={`text-sm font-semibold ${
                    lowStock ? "text-orange-400" : "text-green-400"
                  }`}
                >
                  {lowStock
                    ? `Only ${product.stock} units left!`
                    : `In Stock (${product.stock} units)`}
                </span>
              </>
            ) : (
              <span className="text-red-400 font-semibold text-sm">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Brand */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-dark-400">Brand:</span>
            <span className="text-white font-semibold">{product.brand}</span>
          </div>

          {/* Compatibility Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-yellow-400 font-bold">
                Vehicle Compatibility
              </h3>
            </div>
            <p className="text-dark-300 text-sm mb-3">
              This part is designed to fit the following vehicle models. Please
              verify your vehicle year and variant before purchase:
            </p>
            <ul className="space-y-1.5">
              {product.compatibleModels.map((model) => (
                <li key={model} className="flex items-center gap-2 text-sm">
                  <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-white">{model}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-white font-bold">Product Description</h3>
            <p className="text-dark-200 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`btn-primary flex-1 justify-center py-4 text-base transition-all ${
                added ? "from-green-600 to-green-700 hover:from-green-500" : ""
              } disabled:opacity-50`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  {inStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>

          <p className="text-center text-xs text-dark-400">
            🔒 100% Genuine OEM Parts • 1 Year Manufacturer Warranty
          </p>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-10 border-t border-dark-750">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Reviews Summary */}
          <div className="space-y-5">
            <h2 className="text-xl font-black text-white">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-white">{product.rating.toFixed(1)}</span>
              <div>
                <div className="flex items-center gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating) ? "fill-yellow-400" : "text-dark-600"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-dark-400 mt-1">Based on {reviewsList.length} verified reviews</p>
              </div>
            </div>

            {/* Progress breakdown bars */}
            <div className="space-y-2">
              {[
                { stars: 5, pct: "75%" },
                { stars: 4, pct: "20%" },
                { stars: 3, pct: "5%" },
                { stars: 2, pct: "0%" },
                { stars: 1, pct: "0%" },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-dark-300 font-bold">{row.stars} star</span>
                  <div className="flex-1 h-2 bg-dark-750 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-dark-400 text-right">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Reviews ({reviewsList.length})</h3>
            </div>

            <div className="space-y-4 divide-y divide-dark-750">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-bold">{rev.name}</span>
                      {rev.verified && (
                        <span className="text-[8px] uppercase tracking-wider bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-black">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-dark-450">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-0.5 text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-yellow-400" : "text-dark-600"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-dark-250 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Write a Review form */}
            <div className="bg-dark-850 border border-dark-700/60 rounded-3xl p-6 mt-8 relative overflow-hidden">
              <h3 className="text-white font-extrabold text-sm mb-4">Write a Review</h3>
              
              {formSuccess ? (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4 text-xs font-bold text-center">
                  ✓ Thank you! Your review has been added successfully.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-dark-200 font-bold">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        className="bg-dark-900 border border-dark-650 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white w-full outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-dark-200 font-bold">Rating</label>
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="bg-dark-900 border border-dark-650 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white w-full outline-none"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-dark-200 font-bold">Review Comments</label>
                    <textarea
                      rows={3}
                      placeholder="Write details about product quality, fitment ease, delivery status, etc..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="bg-dark-900 border border-dark-650 focus:border-brand-500 rounded-xl px-4 py-2.5 text-xs text-white w-full outline-none resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary text-xs py-2.5 px-4 font-bold shadow-md">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
