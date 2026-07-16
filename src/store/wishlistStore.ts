import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./cartStore";

interface WishlistStore {
  items: Product[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  clearWishlist: () => void;
  hasItem: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleWishlist: () => set((state) => ({ isOpen: !state.isOpen })),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      clearWishlist: () => set({ items: [] }),

      hasItem: (productId) => get().items.some((item) => item.id === productId),
    }),
    {
      name: "autoparts-wishlist",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
