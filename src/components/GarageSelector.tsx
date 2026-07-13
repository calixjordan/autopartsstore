"use client";

import { useState, useEffect } from "react";
import { useGarageStore, Vehicle } from "@/store/garageStore";
import { Car, ChevronDown, Check, Trash2, Plus, X } from "lucide-react";

const BRAND_MODELS: Record<string, string[]> = {
  Toyota: ["Corolla", "Camry", "RAV4", "Fortuner", "Innova Hycross", "Land Cruiser", "Yaris"],
  Honda: ["City", "Civic", "Accord", "CR-V", "Amaze", "Jazz"],
  BMW: ["3 Series", "5 Series", "7 Series", "X3", "X5", "M3"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  Volkswagen: ["Polo", "Golf", "Tiguan", "Passat", "Taigun", "Virtus"],
  Ford: ["Mustang", "F-150", "Explorer", "EcoSport", "Endeavour"],
  Hyundai: ["Creta", "i20", "Verna", "Venue", "Tucson", "Elantra"],
  Tata: ["Nexon", "Harrier", "Safari", "Altroz", "Tiago", "Punch"],
  Mahindra: ["Thar", "Scorpio-N", "XUV700", "Bolero", "Scorpio Classic"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Audi: ["A4", "A6", "Q3", "Q5", "Q7"],
  Nissan: ["Magnite", "Kicks", "GT-R", "Sunny"],
  Porsche: ["911 Carrera", "Cayenne", "Macan", "Panamera"],
};

const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

export function GarageSelector() {
  const { activeVehicle, savedVehicles, setActiveVehicle, addVehicle, removeVehicle } = useGarageStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form states
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !year) return;
    
    const newVehicle: Vehicle = {
      id: Math.random().toString(36).slice(2),
      brand,
      model,
      year,
    };
    
    addVehicle(newVehicle);
    // Reset form
    setBrand("");
    setModel("");
    setYear("");
  };

  const activeLabel = activeVehicle 
    ? `${activeVehicle.brand} ${activeVehicle.model} (${activeVehicle.year})`
    : "Select Your Vehicle";

  return (
    <div className="relative z-30">
      {/* Floating Garage Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 ${
          activeVehicle 
            ? "bg-green-500/10 border-green-500/30 hover:border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
            : "bg-dark-800 border-dark-600 hover:border-brand-500 text-dark-200 hover:text-white"
        }`}
      >
        <Car className="w-4 h-4" />
        <span className="truncate max-w-[150px]">{activeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Garage Dropdown Modal */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-dark-950 border border-dark-750 rounded-2xl shadow-2xl p-5 z-20 animate-fade-in space-y-5">
            <div className="flex items-center justify-between border-b border-dark-750 pb-3">
              <div className="flex items-center gap-2">
                <Car className="w-4.5 h-4.5 text-brand-400" />
                <h3 className="text-sm font-bold text-white">My Garage</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Saved Vehicles List */}
            {savedVehicles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-dark-400">Select Active Car</h4>
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
                  {savedVehicles.map((vehicle) => {
                    const isActive = activeVehicle?.id === vehicle.id;
                    return (
                      <div 
                        key={vehicle.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                          isActive 
                            ? "bg-green-500/10 border-green-500/40 text-green-400 font-bold" 
                            : "bg-dark-900 border-dark-800 text-dark-200 hover:border-dark-600"
                        }`}
                        onClick={() => setActiveVehicle(vehicle)}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isActive && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                          <span className="truncate">{vehicle.brand} {vehicle.model} ({vehicle.year})</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVehicle(vehicle.id);
                          }}
                          className="text-dark-400 hover:text-red-400 p-1 hover:bg-red-500/10 rounded transition-all"
                          title="Remove from garage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add New Vehicle Form */}
            <form onSubmit={handleAddVehicle} className="space-y-3 pt-2 border-t border-dark-750">
              <h4 className="text-[10px] uppercase font-bold tracking-wider text-dark-400 flex items-center gap-1.5">
                <Plus className="w-3 h-3" /> Add Vehicle
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {/* Brand Selection */}
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel("");
                  }}
                  className="bg-dark-900 text-white border border-dark-750 rounded-xl px-2.5 py-2 text-xs focus:border-brand-500 outline-none"
                  required
                >
                  <option value="" className="bg-dark-950">Make</option>
                  {Object.keys(BRAND_MODELS).map((b) => (
                    <option key={b} value={b} className="bg-dark-950">{b}</option>
                  ))}
                </select>

                {/* Model Selection */}
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-dark-900 text-white border border-dark-750 rounded-xl px-2.5 py-2 text-xs focus:border-brand-500 outline-none disabled:opacity-50"
                  disabled={!brand}
                  required
                >
                  <option value="" className="bg-dark-950">Model</option>
                  {brand && BRAND_MODELS[brand].map((m) => (
                    <option key={m} value={m} className="bg-dark-950">{m}</option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div className="flex gap-2">
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="flex-1 bg-dark-900 text-white border border-dark-750 rounded-xl px-2.5 py-2 text-xs focus:border-brand-500 outline-none"
                  required
                >
                  <option value="" className="bg-dark-950">Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-dark-950">{y}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="btn-primary py-2 px-4 rounded-xl text-xs font-bold"
                >
                  Save Car
                </button>
              </div>
            </form>

            {activeVehicle && (
              <button
                onClick={() => setActiveVehicle(null)}
                className="w-full text-center text-xs text-dark-400 hover:text-white pt-1 transition-colors"
              >
                Clear Active Vehicle Fitment filter
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
