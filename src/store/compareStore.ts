import { create } from "zustand";
import { Product } from "@/types";

interface CompareState {
  items: Product[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  items: [],
  isOpen: false,
  addItem: (product) =>
    set((state) => {
      if (state.items.find((item) => item.id === product.id)) return state; // already added
      if (state.items.length >= 3) return state; // limit to 3 items
      return { items: [...state.items, product] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),
  clear: () => set({ items: [] }),
  setOpen: (open) => set({ isOpen: open }),
}));
