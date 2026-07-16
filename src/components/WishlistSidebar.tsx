"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export function WishlistSidebar() {
  const { items, isOpen, closeWishlist, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeItems = mounted ? items : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeWishlist}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-800/95 backdrop-blur-xl border-l border-dark-600/50 shadow-2xl flex flex-col h-full animate-slide-in-right">
          {/* Header */}
          <div className="p-6 border-b border-dark-600/30 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-500 fill-brand-500 animate-pulse" />
              Saved Spares ({activeItems.length})
            </h2>
            <button
              onClick={closeWishlist}
              className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-dark-700/60 flex items-center justify-center text-dark-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Wishlist is empty</h3>
                  <p className="text-xs text-dark-300 mt-1 max-w-xs leading-relaxed">
                    Save compatible parts here while browsing to compare or buy them later!
                  </p>
                </div>
              </div>
            ) : (
              activeItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-dark-900/50 border border-dark-700/40 rounded-2xl p-4 flex gap-4 hover:border-brand-500/20 transition-all"
                >
                  <div className="relative w-16 h-16 bg-dark-700 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white text-xs font-semibold truncate hover:text-brand-400 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-dark-300 mt-0.5 font-mono">
                        PN: {product.partNumber}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-white">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            addToCart(product as never);
                            removeItem(product.id);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-brand-500 text-dark-900 font-bold text-[10px] hover:bg-brand-400 flex items-center gap-1 transition-all"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {activeItems.length > 0 && (
            <div className="p-6 border-t border-dark-600/30 bg-dark-900/20 space-y-4">
              <button
                onClick={clearWishlist}
                className="w-full btn-secondary text-xs py-2.5 justify-center"
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
