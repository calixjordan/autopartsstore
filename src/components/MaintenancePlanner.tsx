"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Wrench, Check, Plus, AlertCircle, ShoppingCart } from "lucide-react";

interface KitItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  partNumber: string;
  category: string;
  brand: string;
  stock: number;
}

interface MaintenanceKit {
  mileage: number;
  name: string;
  description: string;
  discountPrice: number;
  items: KitItem[];
}

const SERVICE_KITS: MaintenanceKit[] = [
  {
    mileage: 10000,
    name: "10,000 km Minor Lube Service Kit",
    description: "Essential fluid replacement and lubrication optimization for early-stage vehicle health.",
    discountPrice: 2100,
    items: [
      {
        id: "kit-oil-filter",
        name: "OEM High-Performance Spin-On Oil Filter",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-OIL-10K",
        category: "Engine",
        brand: "Bosch Genuine India",
        stock: 50,
      },
      {
        id: "kit-engine-oil",
        name: "Fully Synthetic Engine Oil 5W-40 (4 Litres)",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        partNumber: "LUB-SYN-5W40",
        category: "Engine",
        brand: "Mobil 1 Spares",
        stock: 35,
      },
    ],
  },
  {
    mileage: 30000,
    name: "30,000 km Standard Inspection & Filter Kit",
    description: "Replacement of all primary filters to protect the engine intake and maintain clean cabin airflow.",
    discountPrice: 3850,
    items: [
      {
        id: "kit-oil-filter",
        name: "OEM High-Performance Spin-On Oil Filter",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-OIL-10K",
        category: "Engine",
        brand: "Bosch Genuine India",
        stock: 50,
      },
      {
        id: "kit-engine-oil",
        name: "Fully Synthetic Engine Oil 5W-40 (4 Litres)",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        partNumber: "LUB-SYN-5W40",
        category: "Engine",
        brand: "Mobil 1 Spares",
        stock: 35,
      },
      {
        id: "kit-air-filter",
        name: "High-Flow Pleated Engine Air Filter",
        price: 750,
        imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-AIR-30K",
        category: "Engine",
        brand: "Denso Corporation",
        stock: 40,
      },
      {
        id: "kit-cabin-filter",
        name: "Activated Carbon Cabin AC Filter",
        price: 950,
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-CAB-30K",
        category: "Cooling",
        brand: "VALEO Aftermarket",
        stock: 25,
      },
    ],
  },
  {
    mileage: 50000,
    name: "50,000 km Major Ignition & Fluid Kit",
    description: "Complete tune-up of ignition cycles and hydraulic fluid pressure restoration.",
    discountPrice: 6550,
    items: [
      {
        id: "kit-oil-filter",
        name: "OEM High-Performance Spin-On Oil Filter",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-OIL-10K",
        category: "Engine",
        brand: "Bosch Genuine India",
        stock: 50,
      },
      {
        id: "kit-engine-oil",
        name: "Fully Synthetic Engine Oil 5W-40 (4 Litres)",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        partNumber: "LUB-SYN-5W40",
        category: "Engine",
        brand: "Mobil 1 Spares",
        stock: 35,
      },
      {
        id: "kit-spark-plugs",
        name: "Laser Iridium High-Performance Spark Plugs (Set of 4)",
        price: 3600,
        imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80",
        partNumber: "PLG-IRD-50K",
        category: "Electronics",
        brand: "NGK Ignition",
        stock: 15,
      },
      {
        id: "kit-brake-fluid",
        name: "DOT 4 High-Temperature Brake Fluid (1 Litre)",
        price: 850,
        imageUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLD-BRK-DOT4",
        category: "Brakes",
        brand: "Brembo Premium Fluids",
        stock: 20,
      },
    ],
  },
  {
    mileage: 80000,
    name: "80,000 km Comprehensive Renewal Kit",
    description: "Heavy duty overhaul kit ensuring perfect suspension response, ignition cycles, and front braking power.",
    discountPrice: 9950,
    items: [
      {
        id: "kit-oil-filter",
        name: "OEM High-Performance Spin-On Oil Filter",
        price: 450,
        imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-OIL-10K",
        category: "Engine",
        brand: "Bosch Genuine India",
        stock: 50,
      },
      {
        id: "kit-engine-oil",
        name: "Fully Synthetic Engine Oil 5W-40 (4 Litres)",
        price: 1850,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        partNumber: "LUB-SYN-5W40",
        category: "Engine",
        brand: "Mobil 1 Spares",
        stock: 35,
      },
      {
        id: "kit-spark-plugs",
        name: "Laser Iridium High-Performance Spark Plugs (Set of 4)",
        price: 3600,
        imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&auto=format&fit=crop&q=80",
        partNumber: "PLG-IRD-50K",
        category: "Electronics",
        brand: "NGK Ignition",
        stock: 15,
      },
      {
        id: "kit-brake-pads",
        name: "Low-Dust Premium Ceramic Front Brake Pads",
        price: 3200,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80",
        partNumber: "PAD-CER-FRONT",
        category: "Brakes",
        brand: "Brembo Racing",
        stock: 12,
      },
      {
        id: "kit-cabin-filter",
        name: "Activated Carbon Cabin AC Filter",
        price: 950,
        imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format&fit=crop&q=80",
        partNumber: "FLT-CAB-30K",
        category: "Cooling",
        brand: "VALEO Aftermarket",
        stock: 25,
      },
    ],
  },
];

export function MaintenancePlanner() {
  const [kmInput, setKmInput] = useState<string>("35000");
  const [activeKit, setActiveKit] = useState<MaintenanceKit | null>(SERVICE_KITS[1]);
  const [addedKitIndex, setAddedKitIndex] = useState<number | null>(null);
  
  const { addItem } = useCartStore();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const mileage = parseInt(kmInput) || 0;
    
    // Find closest kit recommendation
    let bestMatch = SERVICE_KITS[0];
    let minDiff = Math.abs(mileage - SERVICE_KITS[0].mileage);
    
    for (const kit of SERVICE_KITS) {
      const diff = Math.abs(mileage - kit.mileage);
      if (diff < minDiff) {
        minDiff = diff;
        bestMatch = kit;
      }
    }
    
    setActiveKit(bestMatch);
    setAddedKitIndex(null);
  };

  const handleAddKitToCart = () => {
    if (!activeKit) return;
    
    activeKit.items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        description: `Part of ${activeKit.name}. OEM Specification fitment. Brand: ${item.brand}`,
        price: item.price,
        imageUrl: item.imageUrl,
        partNumber: item.partNumber,
        category: item.category,
        brand: item.brand,
        compatibleModels: ["All Models (Universal Fitment)"],
        stock: item.stock,
        rating: 4.8,
        reviewCount: 30,
      });
    });

    const kitIndex = SERVICE_KITS.indexOf(activeKit);
    setAddedKitIndex(kitIndex);
  };

  return (
    <section className="bg-dark-850 border border-dark-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Planner Input Fields */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-400" />
              Milestone Maintenance Kit Planner
            </h2>
            <p className="text-xs text-dark-300 mt-1">
              Enter your vehicle's odometer mileage to instantly retrieve factory service kit recommendations and part schedules.
            </p>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4 bg-dark-950 border border-dark-800 rounded-2xl p-5">
            <div className="space-y-2">
              <label htmlFor="odometer" className="text-xs font-bold text-dark-200">
                Odometer Reading (KM)
              </label>
              <div className="relative">
                <input
                  id="odometer"
                  type="number"
                  placeholder="e.g. 35000"
                  value={kmInput}
                  onChange={(e) => setKmInput(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-700 focus:border-brand-500 rounded-xl pl-4 pr-12 py-3 text-sm text-white outline-none transition-colors"
                  min="1000"
                  max="300000"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-dark-400">
                  KM
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center py-3 text-xs font-bold shadow-[0_0_15px_rgba(249,115,22,0.15)]"
            >
              Analyze Service Schedule
            </button>
          </form>

          {/* Warning Indicator */}
          <div className="flex gap-2.5 items-start bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl p-3.5 text-[11px] leading-relaxed">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Fitment Advisory:</strong> Oil and fuel filters are critical engine seal barriers. Always replace them together at scheduled milestones to preserve manufacturer warranty terms.
            </p>
          </div>
        </div>

        {/* Right Side: Recommended Kit Breakdown Panel */}
        <div className="lg:col-span-7">
          {activeKit ? (
            <div className="bg-dark-900/60 border border-dark-750 rounded-2xl p-6 space-y-5 relative">
              <div className="absolute top-0 right-0 bg-brand-500/10 border-l border-b border-brand-500/20 text-brand-400 font-extrabold text-[9px] tracking-widest uppercase py-1 px-3.5 rounded-bl-xl">
                Recommended Milestone Match
              </div>

              <div>
                <h3 className="text-sm font-black text-white mb-1">
                  {activeKit.name}
                </h3>
                <p className="text-[11px] text-dark-300">
                  {activeKit.description}
                </p>
              </div>

              {/* Items Breakdown list */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {activeKit.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-dark-950/80 border border-dark-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-dark-900 overflow-hidden border border-dark-750 flex-shrink-0 flex items-center justify-center">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-dark-400">{item.brand} | {item.partNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-white">₹{item.price.toLocaleString("en-IN")}</p>
                      <span className="text-[9px] text-green-400 bg-green-500/10 rounded px-1.5 py-0.5 border border-green-500/10 font-bold uppercase">
                        Genuine
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing sub-summary & Add to Cart button */}
              <div className="border-t border-dark-700/60 pt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] text-dark-400 font-bold uppercase">
                    Service Bundle Price
                  </p>
                  <p className="text-2xl font-black text-brand-400">
                    ₹{activeKit.discountPrice.toLocaleString("en-IN")}
                    <span className="text-xs text-dark-300 line-through font-normal ml-2">
                      ₹{activeKit.items.reduce((a, b) => a + b.price, 0).toLocaleString("en-IN")}
                    </span>
                  </p>
                </div>

                {addedKitIndex === SERVICE_KITS.indexOf(activeKit) ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 font-bold py-3 px-6 rounded-xl flex items-center gap-2 text-xs">
                    <Check className="w-4 h-4" /> Added to Cart!
                  </div>
                ) : (
                  <button
                    onClick={handleAddKitToCart}
                    className="btn-primary py-3 px-6 text-xs font-extrabold shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add Service Kit to Cart
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-dark-900/60 border border-dark-750 rounded-2xl p-10 text-center text-dark-400 text-xs">
              Enter mileage above and click analyze to see recommended service kits.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
