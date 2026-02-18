"use client";
import { Package, AlertCircle, RefreshCw } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";

export default function InventoryPage() {
    const { totalValue, lowStockItems, items } = useInventory();

    // Derived stats
    const expiringSoonCount = 5; // Mocked for now as we don't have expiration dates yet

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Live Inventory</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Real-time stock levels across all active vendors.</p>
                </div>
                <button className="px-4 py-2 bg-white text-charcoal/70 text-sm font-medium border border-light-green/30 rounded-lg hover:bg-light-green/10 flex items-center gap-2 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-charcoal/60 text-sm font-medium">Total Stock Value</p>
                            <h3 className="text-2xl font-bold text-charcoal mt-2">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(totalValue)}
                            </h3>
                        </div>
                        <div className="p-2 bg-light-green/10 text-deep-green rounded-lg border border-light-green/20">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-charcoal/60 text-sm font-medium">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-amber-600 mt-2">{lowStockItems.length} Items</h3>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-charcoal/60 text-sm font-medium">Expiring Soon</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-2">{expiringSoonCount} Batches</h3>
                        </div>
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-light-green/30 text-center py-20">
                <Package className="w-16 h-16 text-light-green/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-charcoal">Inventory Detailed View</h3>
                <p className="text-charcoal/50 max-w-sm mx-auto mt-2">Select a specific vendor from the Vendors page to view their granular inventory details.</p>
                <button className="mt-6 px-6 py-2 bg-deep-green text-white font-medium rounded-lg hover:bg-deep-green/90 shadow-lg shadow-deep-green/20 transition-all">
                    Go to Vendors
                </button>
            </div>
        </div>
    );
}
