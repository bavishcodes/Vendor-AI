"use client";
import React, { useState } from "react";
import { X, Calendar, Package, Ruler, Truck, Clock, IndianRupee, MapPin, Store, AlertTriangle } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { useVendors } from "@/context/VendorContext";
import { useAuth } from "@/context/AuthContext";
import { useStockRequests } from "@/context/StockRequestContext";

interface StockRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function StockRequestModal({ isOpen, onClose }: StockRequestModalProps) {
    const { items } = useInventory();
    const { vendors } = useVendors();
    const { user } = useAuth();
    const { addRequest } = useStockRequests();

    const [formData, setFormData] = useState({
        productName: "",
        quantity: "",
        unit: "kg",
        deliveryDateTime: "",
        currentStock: "",
        sellingPeriod: "1 day",
        preferredSupplier: "",
        maxPrice: ""
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addRequest({
            productName: formData.productName,
            quantity: Number(formData.quantity),
            unit: formData.unit,
            deliveryDateTime: formData.deliveryDateTime,
            currentStock: Number(formData.currentStock) || 0,
            sellingPeriod: formData.sellingPeriod,
            preferredSupplier: formData.preferredSupplier,
            maxPrice: formData.maxPrice
        });

        alert("Stock request submitted successfully!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-light-green/20 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-deep-green p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-amber-400" />
                            Request New Stock
                        </h2>
                        <p className="text-white/70 text-sm mt-1">Fill out the details to request inventory restock.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                    {/* Auto-filled Section */}
                    <div className="grid grid-cols-2 gap-4 bg-light-green/5 p-4 rounded-2xl border border-light-green/10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Store className="w-4 h-4 text-deep-green" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold">Shop Name</p>
                                <p className="text-sm font-semibold text-charcoal">{user?.name || "Shop Keeper"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <MapPin className="w-4 h-4 text-deep-green" />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-charcoal/40 font-bold">Current Location</p>
                                <p className="text-sm font-semibold text-charcoal">Koramangala, 5th Block</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <Package className="w-4 h-4 text-deep-green/60" />
                                Product Name *
                            </label>
                            <select
                                required
                                value={formData.productName}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const selectedItem = items.find(item => item.name === selectedName);
                                    setFormData({
                                        ...formData,
                                        productName: selectedName,
                                        currentStock: selectedItem ? selectedItem.quantity.toString() : formData.currentStock,
                                        unit: selectedItem ? selectedItem.unit : formData.unit,
                                    });
                                }}
                                className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                            >
                                <option value="">Select a product</option>
                                {items.map(item => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                ))}
                                <option value="Other">Other (Add manually)</option>
                            </select>
                        </div>

                        {/* Quantity & Unit */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-deep-green/60" />
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="0"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                    <Ruler className="w-4 h-4 text-deep-green/60" />
                                    Unit *
                                </label>
                                <select
                                    required
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="kg">kg</option>
                                    <option value="piece">piece</option>
                                    <option value="litre">litre</option>
                                </select>
                            </div>
                        </div>

                        {/* Delivery Schedule */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-deep-green/60" />
                                Preferred Delivery *
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.deliveryDateTime}
                                onChange={(e) => setFormData({ ...formData, deliveryDateTime: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal"
                            />
                        </div>

                        {/* Current Stock */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500/60" />
                                Current Stock
                            </label>
                            <input
                                type="number"
                                placeholder="Auto-filled"
                                value={formData.currentStock}
                                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                                className="w-full px-4 py-2.5 bg-light-green/5 border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal"
                            />
                        </div>

                        {/* Selling Period */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <Truck className="w-4 h-4 text-deep-green/60" />
                                Expected Selling Period
                            </label>
                            <select
                                value={formData.sellingPeriod}
                                onChange={(e) => setFormData({ ...formData, sellingPeriod: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                            >
                                <option value="1 day">1 day</option>
                                <option value="2 days">2 days</option>
                                <option value="3 days">3 days</option>
                                <option value="More than 3 days">More than 3 days</option>
                            </select>
                        </div>

                        {/* Preferred Supplier */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <Store className="w-4 h-4 text-deep-green/60" />
                                Preferred Supplier (Optional)
                            </label>
                            <select
                                value={formData.preferredSupplier}
                                onChange={(e) => setFormData({ ...formData, preferredSupplier: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23064e3b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
                            >
                                <option value="">No preference</option>
                                {vendors.map(vendor => (
                                    <option key={vendor.id} value={vendor.name}>{vendor.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Max Price */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-charcoal flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-deep-green/60" />
                                Max Price Willing to Pay (Optional)
                            </label>
                            <input
                                type="number"
                                placeholder="Enter amount if restricted"
                                value={formData.maxPrice}
                                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-light-green/30 rounded-xl focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-light-green/30 text-charcoal font-bold rounded-2xl hover:bg-light-green/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] bg-deep-green hover:bg-deep-green/90 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-deep-green/20 transform active:scale-[0.98]"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
