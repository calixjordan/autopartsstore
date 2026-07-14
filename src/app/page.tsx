"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Package, Loader2, RefreshCw, Car, Shield, Truck, Wrench, Star, MessageSquare, ArrowRight, ArrowLeft, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Product } from "@/types";
import { useGarageStore } from "@/store/garageStore";
import { BlueprintExplorer } from "@/components/BlueprintExplorer";
import { MaintenancePlanner } from "@/components/MaintenancePlanner";

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

function ServicesSection() {
  return (
    <section className="my-12 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-black text-white">Services We Offer</h2>
        <p className="text-xs text-dark-400 mt-1">High-quality automotive solutions tailored to your repair needs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Shield,
            title: "100% Genuine OES Spares",
            desc: "Direct supply from certified parts manufacturers (MOBIS, Bosch, Denso, Delphi) with official warranties."
          },
          {
            icon: Truck,
            title: "Pan-India Express Shipping",
            desc: "Fast delivery to 25,000+ pin codes. Dispatched within 24 hours with real-time SMS tracking updates."
          },
          {
            icon: Wrench,
            title: "Guaranteed Fitment Support",
            desc: "Advanced model-range checker ensures parts compatibility. 100% refund if a guaranteed part doesn't fit."
          },
          {
            icon: MessageSquare,
            title: "24/7 Technical Support",
            desc: "Talk to our team of certified automotive engineers for assistance with part diagnostics and installation."
          }
        ].map((service) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="bg-dark-850 border border-dark-700/60 rounded-3xl p-5 hover:border-brand-500/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{service.title}</h3>
              <p className="text-xs text-dark-300 leading-relaxed">{service.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="my-12 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-black text-white">What Our Customers Say</h2>
        <p className="text-xs text-dark-400 mt-1">Real reviews from verified car owners and professional mechanics</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Rajesh Kumar",
            role: "Tata Harrier Owner",
            review: "Ordered an OEM alternator for my Safari. Fits perfectly and cost 45% less than the authorised workshop. The compatibility checker was 100% spot on!",
            rating: 5,
            date: "3 days ago"
          },
          {
            name: "Priya Sharma",
            role: "Honda City Owner",
            review: "Extremely fast shipping! Ordered brake pads in Delhi and received them in Mumbai within 36 hours. High-quality packaging with original brand tags.",
            rating: 5,
            date: "1 week ago"
          },
          {
            name: "Amit Patel",
            role: "Workshop Owner",
            review: "The comparison tool is amazing. I compared Bosch vs Brembo disc rotors side-by-side easily. Very convenient for mechanics who order parts in bulk.",
            rating: 4.8,
            date: "2 weeks ago"
          }
        ].map((rev) => (
          <div key={rev.name} className="bg-dark-850 border border-dark-700/60 rounded-3xl p-6 relative">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rev.rating) ? "text-yellow-400 fill-yellow-400" : "text-dark-500"
                  }`}
                />
              ))}
              <span className="text-[10px] text-dark-300 font-bold ml-1">{rev.rating}</span>
            </div>
            <p className="text-xs text-dark-200 leading-relaxed italic mb-4">"{rev.review}"</p>
            <div className="flex items-center justify-between gap-2 border-t border-dark-750 pt-3">
              <div>
                <p className="text-white text-xs font-bold">{rev.name}</p>
                <p className="text-[10px] text-dark-400">{rev.role}</p>
              </div>
              <span className="text-[10px] text-dark-400">{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Are all spare parts in the catalog genuine?",
      a: "Yes, we guarantee 100% genuine spare parts. Every product is sourced directly from OEM (Original Equipment Manufacturer) or OES (Original Equipment Supplier) factories like MOBIS, Bosch, Denso, and Delphi, complete with manufacturer warranty cards."
    },
    {
      q: "How does the Fitment Compatibility Guarantee work?",
      a: "Simply select your vehicle's make, model, and year in 'My Garage' or using our Fitment Checker. If a part marked with our green Fitment Badge does not physically fit your car during assembly, you are eligible for a 100% return refund within 7 days."
    },
    {
      q: "What is your shipping timeframe and cost?",
      a: "We offer express shipping across 25,000+ pin codes in India. Shipping is FREE for all orders above ₹4,999. Orders are generally dispatched within 24 hours of payment and delivered within 2-4 business days depending on location."
    },
    {
      q: "Can I return a part if I order the wrong one by mistake?",
      a: "Yes! You can return any part within 7 days of delivery. The item must be in its original condition, unused, with brand packaging, serials, and seals intact. Parts showing mechanical installation marks or wear cannot be returned."
    },
    {
      q: "Do you provide installation services or mechanic bookings?",
      a: "While we do not offer direct installation, we provide a 24/7 technical hotline for mechanical queries. Additionally, we can recommend certified partner workshops in major Indian cities for hassle-free assembly."
    }
  ];

  return (
    <section className="my-16 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-xl font-black text-white">Frequently Asked Questions</h2>
        <p className="text-xs text-dark-400 mt-1">Get instant answers to queries regarding compatibility, shipping, and returns</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className="bg-dark-850 border border-dark-700/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-dark-600"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left gap-4"
              >
                <span className="text-xs font-bold text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-400" : ""}`} />
              </button>
              
              {/* Accordion Panel Body */}
              <div className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-40 border-t border-dark-750/30" : "max-h-0"
              }`}>
                <div className="px-6 py-4 text-[11px] text-dark-300 leading-relaxed bg-dark-900/10">
                  {faq.a}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function StoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeVehicle, setActiveVehicle, addVehicle } = useGarageStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  
  // Controls landing page vs catalog store explore state
  const [exploring, setExploring] = useState(false);

  // Auto-explore if search parameters are preset in URL
  useEffect(() => {
    if (
      searchParams.get("search") || 
      searchParams.get("category") || 
      searchParams.get("make") || 
      searchParams.get("model") ||
      searchParams.get("explore") === "true"
    ) {
      setExploring(true);
    }
  }, [searchParams]);

  // Combined Catalog View trigger
  const showCatalogView = exploring || !!(search || (category && category !== "All") || activeVehicle);

  // Finder form inputs
  const [makeInput, setMakeInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [yearInput, setYearInput] = useState("");

  const fetchProducts = useCallback(async () => {
    if (!showCatalogView) {
      setProducts([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") params.set("category", category);
      if (search) params.set("search", search);
      
      if (activeVehicle) {
        params.set("make", activeVehicle.brand);
        params.set("model", activeVehicle.model);
        params.set("year", activeVehicle.year);
      } else if (searchParams.get("make") && searchParams.get("model")) {
        params.set("make", searchParams.get("make")!);
        params.set("model", searchParams.get("model")!);
        if (searchParams.get("year")) params.set("year", searchParams.get("year")!);
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [category, search, activeVehicle, searchParams, showCatalogView]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync state from URL parameters
  useEffect(() => {
    const urlReset = searchParams.get("reset");
    if (urlReset === "true") {
      setExploring(false);
      setActiveVehicle(null);
      setCategory("All");
      setSearch("");
      setSearchInput("");
      router.replace("/");
      return;
    }

    const urlCategory = searchParams.get("category") || "All";
    const urlSearch = searchParams.get("search") || "";
    setCategory(urlCategory);
    setSearch(urlSearch);
    setSearchInput(urlSearch);

    const urlMake = searchParams.get("make");
    const urlModel = searchParams.get("model");
    const urlYear = searchParams.get("year");
    const urlExplore = searchParams.get("explore");

    // Clear and reset view to initial landing if URL is cleared/reset (e.g. clicking brand logo)
    if (!urlSearch && urlCategory === "All" && !urlMake && !urlModel && urlExplore !== "true") {
      setExploring(false);
      setActiveVehicle(null);
      return;
    }

    if (urlMake && urlModel && urlYear) {
      if (!activeVehicle || activeVehicle.brand !== urlMake || activeVehicle.model !== urlModel || activeVehicle.year !== urlYear) {
        setActiveVehicle({
          id: "url-fitment",
          brand: urlMake,
          model: urlModel,
          year: urlYear,
        });
      }
    }
  }, [searchParams]);

  // Sync URL parameters from active state
  useEffect(() => {
    if (!showCatalogView) return; // skip syncing if on landing page view
    
    const params = new URLSearchParams();
    if (category && category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    if (activeVehicle) {
      params.set("make", activeVehicle.brand);
      params.set("model", activeVehicle.model);
      params.set("year", activeVehicle.year);
    }
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  }, [category, search, activeVehicle, router, showCatalogView]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setExploring(true);
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setSearch("");
    setSearchInput("");
    setExploring(true);
  };

  const handleFinderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!makeInput || !modelInput || !yearInput) return;
    
    // Save to garage and auto-explore
    addVehicle({
      id: Math.random().toString(36).slice(2),
      brand: makeInput,
      model: modelInput,
      year: yearInput,
    });
    setExploring(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showCatalogView ? (
        <div className="animate-fade-in space-y-6">
          {/* Active Fitment Filter Bubble */}
          {activeVehicle && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl py-2 px-3 text-xs w-fit mb-2 animate-fade-in font-bold">
              <span>🔍 Showing parts for: {activeVehicle.brand} {activeVehicle.model} {activeVehicle.year ? `(${activeVehicle.year})` : ""}</span>
              <button 
                onClick={() => {
                  setActiveVehicle(null);
                  setExploring(false);
                }}
                className="hover:text-white transition-colors ml-1 font-extrabold"
                title="Clear Fitment Filter"
              >
                ✕
              </button>
            </div>
          )}

          {/* Vehicle Finder Widget */}
          <section className="bg-dark-950 border border-dark-750 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.04),transparent_60%)] pointer-events-none" />
            <div className="relative">
              <h2 className="text-white text-base font-extrabold flex items-center gap-2 mb-1.5">
                <Car className="w-5 h-5 text-brand-400" />
                Find Parts for Your Car
              </h2>
              <p className="text-xs text-dark-300 mb-5">
                Select your vehicle make, model, and year to see only parts that are guaranteed to fit.
              </p>

              <form onSubmit={handleFinderSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* Make Selector */}
                <select
                  value={makeInput}
                  onChange={(e) => {
                    setMakeInput(e.target.value);
                    setModelInput("");
                  }}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-colors"
                  required
                >
                  <option value="" className="bg-dark-950">Select Make</option>
                  {Object.keys(BRAND_MODELS).map((make) => (
                    <option key={make} value={make} className="bg-dark-950">{make}</option>
                  ))}
                </select>

                {/* Model Selector */}
                <select
                  value={modelInput}
                  onChange={(e) => setModelInput(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-colors disabled:opacity-50"
                  disabled={!makeInput}
                  required
                >
                  <option value="" className="bg-dark-950">Select Model</option>
                  {makeInput && BRAND_MODELS[makeInput].map((model) => (
                    <option key={model} value={model} className="bg-dark-950">{model}</option>
                  ))}
                </select>

                {/* Year Selector */}
                <select
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="bg-dark-900 border border-dark-700 rounded-xl px-3 py-3 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 outline-none transition-colors"
                  required
                >
                  <option value="" className="bg-dark-950">Select Year</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-dark-950">{y}</option>
                  ))}
                </select>

                {/* Find Button */}
                <button type="submit" className="btn-primary py-3 justify-center text-sm font-bold shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                  Filter Catalogue
                </button>
              </form>
            </div>
          </section>

          {/* Filters Row */}
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal className="w-5 h-5 text-brand-400" />
                <h2 className="text-lg font-bold text-white">Filter by Category</h2>
              </div>
              {(search || category !== "All") && (
                <button
                  onClick={() => {
                    setCategory("All");
                    setSearch("");
                    setSearchInput("");
                  }}
                  className="flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Filters
                </button>
              )}
            </div>

            <CategoryFilter
              selected={category}
              onSelect={handleCategorySelect}
            />

            {/* Results summary label */}
            <div className="mt-4 flex items-center justify-between text-xs text-dark-300">
              {loading ? (
                <span>Scanning catalog...</span>
              ) : (
                <span>
                  {search ? (
                    <>
                      Found <span className="text-white font-semibold">{total}</span> compatibility results for &quot;
                      <span className="text-brand-400 font-bold">{search}</span>
                      &quot;
                      {category !== "All" && (
                        <>
                          {" "}in{" "}
                          <span className="text-brand-400">{category}</span>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Showing all{" "}
                      <span className="text-white font-semibold">{total}</span> parts
                    </>
                  )}
                </span>
              )}
            </div>
          </section>

          {/* Products Grid */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-red-900/30 border border-red-500/30 flex items-center justify-center">
                <Package className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 font-semibold">{error}</p>
              <button onClick={fetchProducts} className="btn-secondary">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card h-80 animate-pulse">
                  <div className="h-48 bg-dark-700 rounded-t-2xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-dark-700 rounded w-3/4" />
                    <div className="h-3 bg-dark-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center">
                <Search className="w-10 h-10 text-dark-400" />
              </div>
              <p className="text-white font-semibold text-xl">No parts found</p>
              <p className="text-dark-300 text-sm">
                Try a different search term or category
              </p>
              <button
                onClick={() => {
                  setCategory("All");
                  setSearch("");
                  setSearchInput("");
                  setExploring(false);
                }}
                className="btn-primary mt-2"
              >
                <RefreshCw className="w-4 h-4" /> Reset Filter View
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Back button */}
          <div className="pt-8 text-center">
            <button 
              onClick={() => setExploring(false)} 
              className="btn-secondary text-xs inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Introduction Page
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-16 animate-fade-in">
          {/* Brand Intro Hero Page View */}
          <section className="relative rounded-3xl overflow-hidden border border-brand-500/20 bg-dark-850 p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="badge bg-brand-500/15 border border-brand-500/30 text-brand-400 font-extrabold text-[10px] tracking-widest uppercase py-1.5 px-3">
                  Premium Car Spares Hub
                </span>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  Genuine Parts. <br />
                  <span className="bg-gradient-to-r from-brand-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                    Guaranteed Fitment.
                  </span>
                </h1>
                <p className="text-sm text-dark-300 max-w-xl leading-relaxed">
                  AutoPartsIndia is your absolute global destination for authentic car components, electronics, and accessories. Browse 260+ premium components for German, Japanese, US, Indian, and Korean car models.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => setExploring(true)} 
                    className="btn-primary py-3.5 px-8 text-sm font-black shadow-lg shadow-brand-500/20 flex items-center gap-2 group"
                  >
                    Explore Parts Store
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] max-w-sm relative">
                    <input
                      type="text"
                      placeholder="Search parts directly... (e.g. Brake Pads)"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full bg-dark-900 border border-dark-600 focus:border-brand-500 rounded-xl pl-4 pr-10 py-3 text-xs text-white outline-none"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                      <Search className="w-4 h-4" />
                    </button>
                  </form>
                </div>
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <div className="bg-dark-900/60 border border-dark-700/60 rounded-2xl p-3.5 text-center">
                    <p className="text-2xl font-black text-white">260+</p>
                    <p className="text-[10px] text-dark-400 uppercase font-bold mt-1">Car Parts</p>
                  </div>
                  <div className="bg-dark-900/60 border border-dark-700/60 rounded-2xl p-3.5 text-center">
                    <p className="text-2xl font-black text-white">13+</p>
                    <p className="text-[10px] text-dark-400 uppercase font-bold mt-1">Global Brands</p>
                  </div>
                  <div className="bg-dark-900/60 border border-dark-700/60 rounded-2xl p-3.5 text-center">
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[10px] text-dark-400 uppercase font-bold mt-1">OEM Genuine</p>
                  </div>
                  <div className="bg-dark-900/60 border border-dark-700/60 rounded-2xl p-3.5 text-center">
                    <p className="text-2xl font-black text-white">48h</p>
                    <p className="text-[10px] text-dark-400 uppercase font-bold mt-1">Fast Delivery</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 space-y-4">
                {/* Offers Hub Card Grid */}
                <div className="bg-dark-900/80 border border-dark-700 rounded-3xl p-6 relative">
                  <h3 className="text-sm font-extrabold text-white mb-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                    Active Sales & Coupon Codes
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="bg-dark-800 border border-brand-500/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 group hover:border-brand-500/40 transition-all">
                      <div>
                        <p className="text-xs text-white font-black">Monsoon Special Off</p>
                        <p className="text-[10px] text-dark-300 mt-0.5">Flat 15% discount on Brake Pads & Suspensions</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-lg px-2 py-1 uppercase">
                          RAIN15
                        </span>
                      </div>
                    </div>

                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 group hover:border-brand-500/20 transition-all">
                      <div>
                        <p className="text-xs text-white font-black">Free Shipping Offer</p>
                        <p className="text-[10px] text-dark-300 mt-0.5">Valid on orders above ₹4,999</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg px-2 py-1 uppercase">
                          FREESHIP
                        </span>
                      </div>
                    </div>

                    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 group hover:border-brand-500/20 transition-all">
                      <div>
                        <p className="text-xs text-white font-black">UPI SuperSaver</p>
                        <p className="text-[10px] text-dark-300 mt-0.5">Extra 10% cashback on order total above ₹9,999</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg px-2 py-1 uppercase">
                          UPI10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Blueprint Explorer Section */}
          <BlueprintExplorer
            onSelectCategory={(cat) => {
              setCategory(cat);
              setExploring(true);
              router.push(`/?category=${cat}`);
            }}
          />

          {/* Maintenance Planner Section */}
          <MaintenancePlanner />

          {/* Services We Offer Section */}
          <ServicesSection />

          {/* FAQ Accordion Section */}
          <FaqSection />
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
        </div>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
