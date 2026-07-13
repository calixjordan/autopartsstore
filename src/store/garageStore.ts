import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
}

interface GarageState {
  activeVehicle: Vehicle | null;
  savedVehicles: Vehicle[];
  compareItems: string[]; // Product IDs
  setActiveVehicle: (vehicle: Vehicle | null) => void;
  addVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useGarageStore = create<GarageState>()(
  persist(
    (set) => ({
      activeVehicle: null,
      savedVehicles: [],
      compareItems: [],
      setActiveVehicle: (vehicle) => set({ activeVehicle: vehicle }),
      addVehicle: (vehicle) =>
        set((state) => ({
          savedVehicles: [...state.savedVehicles, vehicle],
          activeVehicle: vehicle, // set as active automatically
        })),
      removeVehicle: (id) =>
        set((state) => {
          const filtered = state.savedVehicles.filter((v) => v.id !== id);
          const wasActive = state.activeVehicle?.id === id;
          return {
            savedVehicles: filtered,
            activeVehicle: wasActive ? (filtered.length > 0 ? filtered[0] : null) : state.activeVehicle,
          };
        }),
      toggleCompare: (productId) =>
        set((state) => {
          const exists = state.compareItems.includes(productId);
          if (exists) {
            return { compareItems: state.compareItems.filter((id) => id !== productId) };
          } else {
            if (state.compareItems.length >= 3) {
              // Limit to 3 items for side-by-side comparison
              return { compareItems: [...state.compareItems.slice(1), productId] };
            }
            return { compareItems: [...state.compareItems, productId] };
          }
        }),
      clearCompare: () => set({ compareItems: [] }),
    }),
    {
      name: "autoparts-garage",
      partialize: (state) => ({
        activeVehicle: state.activeVehicle,
        savedVehicles: state.savedVehicles,
      }),
    }
  )
);
