"use client";

import { useState } from "react";
import { Cog, Disc, Zap, Activity, Thermometer, ArrowRight, Car } from "lucide-react";

interface BlueprintExplorerProps {
  onSelectCategory: (category: string) => void;
}

export function BlueprintExplorer({ onSelectCategory }: BlueprintExplorerProps) {
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const hotspots = [
    {
      id: "Engine",
      name: "Engine & Core",
      icon: Cog,
      color: "text-brand-400 border-brand-500/30 bg-brand-500/10 hover:border-brand-500/80 hover:shadow-[0_0_20px_rgba(197,157,63,0.2)]",
      tooltip: "Spark plugs, air filters, turbos, timing belts",
      coords: { x: "22%", y: "45%" },
    },
    {
      id: "Brakes",
      name: "Braking System",
      icon: Disc,
      color: "text-red-400 border-red-500/30 bg-red-500/10 hover:border-red-500/80 hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]",
      tooltip: "Brake pads, rotors, caliper sets, master cylinders",
      coords: { x: "36%", y: "65%" },
    },
    {
      id: "Electronics",
      name: "Electricals & ECU",
      icon: Zap,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10 hover:border-purple-500/80 hover:shadow-[0_0_20px_rgba(192,132,252,0.2)]",
      tooltip: "ECU maps, alternators, ABS sensors, headlights",
      coords: { x: "50%", y: "40%" },
    },
    {
      id: "Suspension",
      name: "Suspension & Steering",
      icon: Activity,
      color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500/80 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)]",
      tooltip: "Shock absorbers, struts, stabilizer links",
      coords: { x: "72%", y: "65%" },
    },
    {
      id: "Cooling",
      name: "Cooling & Climate",
      icon: Thermometer,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10 hover:border-cyan-500/80 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]",
      tooltip: "Radiators, water pumps, coolant expansion tanks",
      coords: { x: "12%", y: "45%" },
    },
  ];

  const handleSpotClick = (spotId: string) => {
    if (hoveredPart === spotId) {
      onSelectCategory(spotId);
    } else {
      setHoveredPart(spotId);
    }
  };

  return (
    <section className="bg-dark-850 border border-dark-700/60 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl animate-fade-in">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.02),transparent_70%)] pointer-events-none" />
      
      <div className="relative mb-6">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
          Interactive Car Blueprint Explorer
        </h2>
        <p className="text-xs text-dark-300 mt-1">
          {typeof window !== 'undefined' && 'ontouchstart' in window 
            ? "Tap a chassis hotspot to view component details, then tap again or tap 'Filter Store Catalog' to search."
            : "Hover over hotspots on the chassis diagram to preview part categories and click to instantly filter the store catalog."
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Chassis Wireframe Visual Block */}
        <div className="lg:col-span-8 relative bg-dark-950 border border-dark-800 rounded-3xl p-6 flex items-center justify-center min-h-[280px] select-none group">
          {/* Glowing background grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] rounded-3xl" />
          
          {/* Wireframe Car Outline SVG */}
          <svg
            className="w-full max-w-[620px] h-auto text-dark-700 transition-colors duration-500 group-hover:text-brand-500/10 opacity-70"
            viewBox="0 0 600 240"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Main Roof & Windshield */}
            <path d="M 280 60 L 370 60 Q 420 60 440 90 L 490 120 M 280 60 L 190 85 Q 160 110 140 120" />
            {/* Front Hood & Grille */}
            <path d="M 140 120 L 70 120 Q 50 120 50 140 L 50 160 Q 50 165 70 165 L 120 165" />
            {/* Rear Boot & Tail */}
            <path d="M 490 120 L 540 120 Q 560 120 560 140 L 560 160 Q 560 165 540 165 L 480 165" />
            {/* Underbody & Side Skirts */}
            <path d="M 180 165 L 420 165" />
            {/* Front Wheel Well */}
            <path d="M 120 165 A 35 35 0 0 1 180 165" />
            {/* Rear Wheel Well */}
            <path d="M 420 165 A 35 35 0 0 1 480 165" />
            {/* Wheels Inner Outline */}
            <circle cx="150" cy="165" r="24" strokeWidth="1" />
            <circle cx="450" cy="165" r="24" strokeWidth="1" />
            {/* Windows side frame */}
            <path d="M 195 90 L 280 70 L 360 70 L 425 95 Z" strokeWidth="1" />
            <path d="M 280 70 L 280 95" strokeWidth="1" strokeDasharray="3 3" />
          </svg>

          {/* Interactive Hotspots Layer */}
          {hotspots.map((spot) => {
            const Icon = spot.icon;
            const isHovered = hoveredPart === spot.id;
            return (
              <button
                key={spot.id}
                onClick={() => handleSpotClick(spot.id)}
                onMouseEnter={() => setHoveredPart(spot.id)}
                onMouseLeave={() => setHoveredPart(null)}
                className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 ${spot.color}`}
                style={{ left: spot.coords.x, top: spot.coords.y }}
                title={`Explore ${spot.name}`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "scale-110 rotate-12" : ""}`} />
                
                {/* Pulsating halo */}
                {isHovered && (
                  <span className="absolute inset-0 rounded-full border-2 border-inherit animate-ping opacity-60 pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {/* Hover Information Panel */}
        <div className="lg:col-span-4 flex flex-col justify-center h-full">
          <div className="bg-dark-900/60 border border-dark-750/50 rounded-2xl p-5 min-h-[180px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl" />
            
            {hoveredPart ? (
              (() => {
                const activeSpot = hotspots.find((h) => h.id === hoveredPart)!;
                const SpotIcon = activeSpot.icon;
                return (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-brand-400">
                      <SpotIcon className="w-5 h-5" />
                      <span className="text-sm font-black text-white">{activeSpot.name}</span>
                    </div>
                    <p className="text-xs text-dark-300 leading-relaxed min-h-[48px]">
                      {activeSpot.tooltip}
                    </p>
                    <button
                      onClick={() => onSelectCategory(activeSpot.id)}
                      className="text-[10px] text-brand-400 font-extrabold flex items-center gap-1 hover:text-brand-300 transition-colors uppercase tracking-wider pt-2"
                    >
                      Filter Store Catalog <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-6 space-y-2">
                <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-dark-500">
                  <Car className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-white">Select a Chassis Hotspot</p>
                <p className="text-[10px] text-dark-400 max-w-[200px] leading-normal">
                  Hover over the circular icons to preview systems or click to view matched spare components.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
