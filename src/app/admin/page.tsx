"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Package, ShieldAlert, Plus, Edit2, Check, RefreshCw, Layers, DollarSign, User, Upload } from "lucide-react";
import { Product } from "@/types";
import Image from "next/image";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  
  // Products Management States
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  
  // Create Product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPartNumber, setNewPartNumber] = useState("");
  const [newCategory, setNewCategory] = useState("Engine");
  const [newBrand, setNewBrand] = useState("");
  const [newCompat, setNewCompat] = useState("");
  
  // Image Upload States
  const [newImageBase64, setNewImageBase64] = useState("");
  const [editImages, setEditImages] = useState<Record<string, string>>({});
  const [searchingImage, setSearchingImage] = useState(false);
  const [searchedPhotos, setSearchedPhotos] = useState<{ id: string; url: string; thumb: string; description: string }[]>([]);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [searchingEditId, setSearchingEditId] = useState<string | null>(null);
  
  // Orders Management States
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch("/api/products?pageSize=100");
      const data = await res.json();
      setProducts(data && Array.isArray(data.products) ? data.products : []);
    } catch (e) {
      console.error("Failed to load products", e);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to load orders", e);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const handleQuickSave = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: parseFloat(editPrice),
          stock: parseInt(editStock),
          ...(editImages[id] && { imageUrl: editImages[id] }),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, price: updated.price, stock: updated.stock, imageUrl: updated.imageUrl } : p))
        );
        setEditingId(null);
        // Clear edit image
        const copy = { ...editImages };
        delete copy[id];
        setEditImages(copy);
      }
    } catch (e) {
      console.error("Failed to update product details", e);
    }
  };

  // Image Upload Change Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImages((prev) => ({ ...prev, [id]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoSearchNewImage = async () => {
    if (!newName.trim()) return;
    setSearchingImage(true);
    setSearchedPhotos([]);
    setActiveSearchQuery(newName);
    try {
      const res = await fetch(`/api/products/search-image?query=${encodeURIComponent(newName)}`);
      const data = await res.json();
      if (data.photos) {
        setSearchedPhotos(data.photos);
      }
    } catch (e) {
      console.error("Auto image search failed", e);
    } finally {
      setSearchingImage(false);
    }
  };

  const handleAutoSearchEditImage = async (id: string, name: string) => {
    setSearchingEditId(id);
    try {
      const res = await fetch(`/api/products/search-image?query=${encodeURIComponent(name)}`);
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        const firstMatchUrl = data.photos[0].url;
        setEditImages((prev) => ({ ...prev, [id]: firstMatchUrl }));
      }
    } catch (e) {
      console.error("Auto image edit assign failed", e);
    } finally {
      setSearchingEditId(null);
    }
  };

  // Create Product Submit
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const compatArray = newCompat
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          description: newDesc,
          price: parseFloat(newPrice),
          stock: parseInt(newStock),
          partNumber: newPartNumber,
          category: newCategory,
          brand: newBrand,
          compatibleModels: compatArray,
          imageUrl: newImageBase64 || "/engine-oem.jpg",
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setShowAddForm(false);
        // Reset states
        setNewName("");
        setNewDesc("");
        setNewPrice("");
        setNewStock("");
        setNewPartNumber("");
        setNewBrand("");
        setNewCompat("");
        setNewImageBase64("");
      }
    } catch (e) {
      console.error("Failed to create product", e);
    }
  };

  // Check if admin is authenticated
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Restricted Access</h1>
          <p className="text-xs text-dark-300 max-w-sm leading-relaxed">
            You must be logged in as an administrator to access the admin portal. Sign in using the admin account to proceed.
          </p>
        </div>
        <div className="bg-dark-850 border border-dark-600/60 rounded-3xl p-6 max-w-sm w-full space-y-4">
          <div className="text-left space-y-1">
            <p className="text-[10px] text-dark-400 font-bold uppercase">Admin Credentials</p>
            <p className="text-xs text-white"><span className="text-dark-300 font-bold">Email:</span> admin@autoparts.in</p>
            <p className="text-xs text-brand-400"><span className="text-dark-300 font-bold">Role:</span> Store Admin Access</p>
          </div>
          <a
            href="/signin"
            className="w-full btn-primary text-xs py-2.5 justify-center"
          >
            Sign In with Admin Account
          </a>
        </div>
      </div>
    );
  }

  // Filter products by search query
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 select-none">
      {/* Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-600/30 pb-6">
        <div>
          <span className="badge bg-brand-500/15 border border-brand-500/30 text-brand-400 font-extrabold text-[10px] tracking-widest uppercase py-1 px-2.5">
            Admin Access Portal
          </span>
          <h1 className="text-3xl font-black text-white mt-2">Store Management Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-dark-850 border border-dark-600/60 rounded-2xl p-2 px-3 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-dark-200">Signed as: <strong className="text-white">{user.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher Layout */}
      <div className="flex border-b border-dark-700">
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-extrabold transition-all ${
            activeTab === "products"
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-dark-300 hover:text-white"
          }`}
        >
          <Package className="w-4 h-4" />
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 text-sm font-extrabold transition-all ${
            activeTab === "orders"
              ? "border-brand-500 text-brand-400"
              : "border-transparent text-dark-300 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Customer Orders ({orders.length})
        </button>
      </div>

      {/* Tab Contents: Products Management */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search filter input */}
            <input
              type="text"
              placeholder="Search parts by name, PN, brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-md bg-dark-850 border border-dark-600 rounded-xl px-4 py-2.5 text-xs text-white placeholder-dark-400 focus:border-brand-500 outline-none"
            />
            
            {/* Add New Product Trigger */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary text-xs py-2.5 px-4 font-extrabold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Catalog Product
            </button>
          </div>

          {/* Add Product Inline Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateProductSubmit}
              className="bg-dark-850 border border-brand-500/20 rounded-3xl p-6 space-y-4 animate-fade-in"
            >
              <h3 className="text-white font-extrabold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-400" /> Insert New Spare Part Record
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Part Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Brand / Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bosch, Brembo, Mobil1"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Category Type</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  >
                    {["Engine", "Brakes", "Suspension", "Electronics", "Cooling", "Exterior"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Stock Count</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Part Number</label>
                  <input
                    type="text"
                    required
                    value={newPartNumber}
                    onChange={(e) => setNewPartNumber(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Compatible Cars (Comma split)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW X5 (2018-2024), Honda City"
                    value={newCompat}
                    onChange={(e) => setNewCompat(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl px-3 py-2 text-xs text-white focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-dark-300 font-bold uppercase">Upload Part Photo</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <label className="flex flex-col items-center justify-center border border-dashed border-brand-500/30 hover:border-brand-500/60 bg-dark-900 rounded-xl px-4 py-3 cursor-pointer hover:bg-dark-850 transition-colors w-full sm:max-w-xs text-center">
                    <span className="text-xs text-brand-400 font-extrabold flex items-center gap-1.5 justify-center"><Upload className="w-3.5 h-3.5" /> Choose Image File</span>
                    <span className="text-[9px] text-dark-400 mt-0.5">Supports PNG, JPG, WebP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoSearchNewImage}
                      disabled={searchingImage || !newName.trim()}
                      className="btn-secondary text-xs py-3 px-4 flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {searchingImage ? (
                        <span className="w-3.5 h-3.5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
                      ) : (
                        "🔍 Auto-Fetch Photo"
                      )}
                    </button>
                    {!newName.trim() && (
                      <span className="text-[9px] text-dark-450 hidden sm:inline">Fill Part Name first</span>
                    )}
                  </div>

                  {newImageBase64 && (
                    <div className="flex items-center gap-2 bg-dark-900/60 border border-dark-600/30 rounded-xl p-2 pr-4 ml-auto">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-brand-500/20 flex-shrink-0">
                        <Image
                          src={newImageBase64}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-green-400 font-bold">Image Set Successfully</p>
                        <p className="text-[8px] text-dark-300 truncate max-w-[120px]">
                          {newImageBase64.startsWith("data:") ? "Local File Upload" : newImageBase64}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {searchedPhotos.length > 0 && (
                  <div className="bg-dark-900 p-4 rounded-2xl border border-dark-700/60 mt-3 space-y-3">
                    <p className="text-[10px] text-dark-400 font-extrabold uppercase">
                      Select matching image below ({searchedPhotos.length} photos found for &quot;{activeSearchQuery}&quot;)
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {searchedPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          onClick={() => {
                            setNewImageBase64(photo.url);
                            setSearchedPhotos([]);
                          }}
                          className="relative aspect-video rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500 cursor-pointer transition-all group"
                        >
                          <Image
                            src={photo.thumb}
                            alt={photo.description}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[9px] font-extrabold text-white bg-brand-500 py-1 px-2.5 rounded-lg">Use Photo</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Create Product
                </button>
              </div>
            </form>
          )}

          {/* Catalog products table lists */}
          {loadingProducts ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : (
            <div className="bg-dark-850 border border-dark-600/40 rounded-3xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-900 border-b border-dark-700/60 text-dark-300 text-[10px] font-bold uppercase tracking-wider">
                      <th className="p-4 px-6">Product Details</th>
                      <th className="p-4">Part Number</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700/40">
                    {filteredProducts.map((p) => {
                      const isEditing = editingId === p.id;
                      return (
                        <tr key={p.id} className="hover:bg-dark-800/40 transition-colors">
                          <td className="p-4 px-6 flex items-center gap-3">
                            <div className="relative w-10 h-10 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-white text-xs font-bold truncate max-w-[220px]">{p.name}</p>
                              <p className="text-[10px] text-dark-300 mt-0.5">{p.brand}</p>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-dark-200">{p.partNumber}</td>
                          <td className="p-4">
                            <span className="badge border border-brand-500/20 text-brand-400 bg-brand-500/5 text-[9px] py-0.5 px-2">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 text-xs font-bold text-white">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-20 bg-dark-900 border border-dark-600 rounded-lg px-2 py-1 text-xs text-white"
                              />
                            ) : (
                              `₹${p.price.toLocaleString("en-IN")}`
                            )}
                          </td>
                          <td className="p-4 text-xs text-dark-100">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editStock}
                                onChange={(e) => setEditStock(e.target.value)}
                                className="w-16 bg-dark-900 border border-dark-600 rounded-lg px-2 py-1 text-xs text-white"
                              />
                            ) : (
                              <span className={p.stock <= 5 ? "text-orange-400 font-bold" : "text-white"}>
                                {p.stock}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {isEditing ? (
                                <div className="flex items-center justify-center gap-2">
                                  <label className="p-1.5 rounded-lg bg-dark-700 text-dark-200 border border-dark-600 hover:text-brand-400 hover:border-brand-500/40 cursor-pointer flex items-center justify-center relative">
                                    <Upload className="w-3.5 h-3.5" />
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleEditImageChange(p.id, e)}
                                      className="hidden"
                                    />
                                    {editImages[p.id] && editImages[p.id].startsWith("data:") && (
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-500 border border-white" />
                                    )}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleAutoSearchEditImage(p.id, p.name)}
                                    disabled={searchingEditId === p.id}
                                    className="p-1.5 rounded-lg bg-dark-700 text-dark-200 border border-dark-600 hover:text-brand-400 hover:border-brand-500/40 flex items-center justify-center relative disabled:opacity-50"
                                    title="Auto-fetch photo from name"
                                  >
                                    {searchingEditId === p.id ? (
                                      <span className="w-3.5 h-3.5 border-2 border-brand-400/30 border-t-brand-400 rounded-full animate-spin" />
                                    ) : (
                                      <Layers className="w-3.5 h-3.5" />
                                    )}
                                    {editImages[p.id] && !editImages[p.id].startsWith("data:") && (
                                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border border-white" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleQuickSave(p.id)}
                                    className="p-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(p.id);
                                  setEditPrice(p.price.toString());
                                  setEditStock(p.stock.toString());
                                }}
                                className="p-1.5 rounded-lg bg-dark-700 text-dark-200 border border-dark-600 hover:text-brand-400 hover:border-brand-500/40"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Orders Management */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="flex justify-center py-20">
              <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-dark-850 border border-dark-600/40 rounded-3xl">
              <p className="text-white font-bold text-sm">No orders registered yet</p>
              <p className="text-xs text-dark-300 mt-1">Orders placed via mock checkouts show up here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-dark-850 border border-dark-600/40 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold text-white">ID: <span className="font-mono text-brand-400">{order.id}</span></span>
                      <span className="text-[10px] text-dark-400 font-mono">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-300 uppercase font-bold">Shipping Destination</p>
                      <p className="text-xs text-white leading-relaxed font-bold">
                        {order.user?.name || "Anonymous Guest"} ({order.user?.email || "No email"})
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-dark-300 uppercase font-bold">Order Items</p>
                      <ul className="text-xs text-dark-200 space-y-0.5 list-disc pl-4">
                        {order.items.map((item: any) => (
                          <li key={item.id}>
                            {item.product?.name || "OEM Part"} × <strong className="text-white">{item.quantity}</strong> (₹{item.price.toLocaleString()})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="text-right flex flex-col justify-between items-end gap-3">
                    <div>
                      <p className="text-[10px] text-dark-300 uppercase font-bold">Order Total</p>
                      <p className="text-2xl font-black text-white">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                    
                    <span className={`badge uppercase text-[10px] font-mono py-1 px-3 border ${
                      order.status === "paid" || order.status === "delivered"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
