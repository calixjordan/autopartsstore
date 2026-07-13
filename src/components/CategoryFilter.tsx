"use client";

import {
  Cog,
  Car,
  Disc,
  Zap,
  ChevronRight,
  Activity,
  Thermometer,
  Settings,
  LayoutGrid,
} from "lucide-react";

const CATEGORIES = [
  { name: "All", icon: LayoutGrid, color: "text-white" },
  { name: "Engine", icon: Cog, color: "text-orange-400" },
  { name: "Exterior", icon: Car, color: "text-blue-400" },
  { name: "Brakes", icon: Disc, color: "text-red-400" },
  { name: "Electronics", icon: Zap, color: "text-purple-400" },
  { name: "Suspension", icon: Activity, color: "text-yellow-400" },
  { name: "Transmission", icon: Settings, color: "text-green-400" },
  { name: "Cooling", icon: Thermometer, color: "text-cyan-400" },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(({ name, icon: Icon, color }) => {
        const isActive = selected === name;
        return (
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
              isActive
                ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30"
                : "bg-dark-800 border-dark-600 text-dark-200 hover:border-dark-400 hover:text-white hover:bg-dark-700"
            }`}
            aria-pressed={isActive}
          >
            <Icon
              className={`w-4 h-4 ${isActive ? "text-white" : color}`}
            />
            {name}
            {isActive && <ChevronRight className="w-3 h-3 opacity-70" />}
          </button>
        );
      })}
    </div>
  );
}
