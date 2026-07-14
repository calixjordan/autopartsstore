"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { X, ArrowRightLeft, Star, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function CompareDrawer() {
  const { items, removeItem, clear, isOpen, setOpen } = useCompareStore();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  const lowestPrice = Math.min(...items.map((i) => i.price));

  return (
    <>
      {/* Floating Compare Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-slide-up">
        <div className="bg-dark-900/90 backdrop-blur-xl border border-brand-500/30 rounded-3xl p-4 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 flex-shrink-0">
              <ArrowRightLeft className="w-4.5 h-4.5" />
            </div>
            <div className="hidden sm:block">
              <h3 className="text-white text-xs font-black">Compare Parts</h3>
              <p className="text-[10px] text-dark-300">{items.length} of 3 items selected</p>
            </div>
          </div>

          {/* Thumbnails grid */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-dark-800 border border-dark-700 flex-shrink-0 group"
              >
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow transition-all opacity-0 group-hover:opacity-100"
                  title="Remove item"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
            {items.length < 3 && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-dashed border-dark-600 flex items-center justify-center text-[9px] sm:text-[10px] text-dark-400 font-bold bg-dark-900/40">
                +{3 - items.length}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setOpen(true)}
              disabled={items.length < 2}
              className="btn-primary py-2 px-2.5 sm:px-4 rounded-xl text-[9px] sm:text-[10px] font-black tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(249,115,22,0.15)] flex items-center gap-1"
            >
              <span>Compare</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={clear}
              className="p-2 sm:p-2.5 rounded-xl border border-dark-750 hover:bg-dark-800 text-dark-300 hover:text-white transition-colors"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Detailed Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* Modal Container */}
          <div className="bg-dark-900 border border-dark-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-fade-in p-6 sm:p-8 scrollbar-thin">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-dark-750 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-brand-400" />
                <h2 className="text-base font-extrabold text-white">Compare Spare Parts Specs</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Grid Table */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-dark-750">
              {/* Labels Column */}
              <div className="hidden sm:flex flex-col justify-between text-[10px] font-bold text-dark-400 uppercase tracking-wider py-4 pr-4 space-y-8">
                <div className="h-44 flex items-end">Part Image</div>
                <div className="py-2.5 border-b border-dark-800/40">Brand / OEM</div>
                <div className="py-2.5 border-b border-dark-800/40">Price (INR)</div>
                <div className="py-2.5 border-b border-dark-800/40">Part Number</div>
                <div className="py-2.5 border-b border-dark-800/40">Compatibility</div>
                <div className="py-2.5 border-b border-dark-800/40">Customer Rating</div>
                <div className="h-10">Add to Cart</div>
              </div>

              {/* Items Columns */}
              {items.map((item) => {
                const isCheapest = item.price === lowestPrice;
                return (
                  <div key={item.id} className="col-span-1 py-4 sm:p-4 flex flex-col justify-between space-y-6 sm:space-y-8">
                    {/* Item header/image */}
                    <div className="space-y-3">
                      <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-dark-800 border border-dark-750">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-2 right-2 bg-dark-900/80 hover:bg-red-500 hover:text-white rounded-lg p-1.5 transition-colors text-dark-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h3 className="text-white text-xs font-black line-clamp-2 h-8 leading-snug">{item.name}</h3>
                    </div>

                    {/* Brand */}
                    <div className="py-2.5 border-b border-dark-800 text-xs text-white font-bold flex items-center justify-between sm:block">
                      <span className="sm:hidden text-dark-400 font-bold uppercase text-[9px] tracking-wider">Brand</span>
                      <span>{item.brand}</span>
                    </div>

                    {/* Price */}
                    <div className="py-2.5 border-b border-dark-800 text-xs flex items-center justify-between sm:block">
                      <span className="sm:hidden text-dark-400 font-bold uppercase text-[9px] tracking-wider">Price</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black ${isCheapest ? "text-green-400 text-sm" : "text-white"}`}>
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        {isCheapest && (
                          <span className="text-[8px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-extrabold uppercase">
                            Cheapest
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Part Number */}
                    <div className="py-2.5 border-b border-dark-800 text-xs font-mono flex items-center justify-between sm:block">
                      <span className="sm:hidden text-dark-400 font-bold uppercase text-[9px] tracking-wider">Part OEM</span>
                      <span className="text-brand-400 font-bold">{item.partNumber}</span>
                    </div>

                    {/* Compatibility */}
                    <div className="py-2.5 border-b border-dark-800 text-[10px] text-dark-300 flex items-center justify-between sm:block">
                      <span className="sm:hidden text-dark-400 font-bold uppercase text-[9px] tracking-wider">Compatible Cars</span>
                      <span className="line-clamp-2 h-7 leading-normal" title={Array.isArray(item.compatibleModels) ? item.compatibleModels.join(", ") : item.compatibleModels}>
                        {Array.isArray(item.compatibleModels) ? item.compatibleModels.join(", ") : item.compatibleModels}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="py-2.5 border-b border-dark-800 text-xs flex items-center justify-between sm:block">
                      <span className="sm:hidden text-dark-400 font-bold uppercase text-[9px] tracking-wider">Rating</span>
                      <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-yellow-400" />
                        <span>{item.rating}</span>
                        <span className="text-[10px] text-dark-400 font-bold">({item.reviewCount})</span>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => {
                        addToCart(item);
                        setOpen(false);
                      }}
                      className="btn-primary py-2.5 justify-center w-full text-xs font-bold"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
