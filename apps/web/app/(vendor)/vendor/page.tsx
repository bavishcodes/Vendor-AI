"use client";
import { useInventory } from "@/context/InventoryContext";
import { TrendingUp, AlertTriangle, Package, Zap, Plus, BarChart3, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import StockRequestModal from "@/components/StockRequestModal";
import { useStockRequests } from "@/context/StockRequestContext";

export default function VendorDashboard() {
    const { items } = useInventory();
    const { requests } = useStockRequests();
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    // Mock Logic for Fast Selling (High Price + Low Stock assumption for demo)
    const fastSelling = items.filter(i => i.price > 50 && i.quantity < 50);

    // Mock Logic for Demanding Stocks (Very low stock)
    const demandingStocks = items.filter(i => i.quantity < 20);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Approved": return "bg-green-50 text-green-700 border-green-200";
            case "Modified": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Rejected": return "bg-red-50 text-red-700 border-red-200";
            case "Requested": return "bg-amber-50 text-amber-700 border-amber-200";
            case "In Transit": return "bg-purple-50 text-purple-700 border-purple-200";
            case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Hello, Shop Keeper!</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Here is how your shop is performing today.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="flex items-center gap-2 bg-deep-green text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-deep-green/90 transition-all shadow-lg shadow-deep-green/20"
                    >
                        <Plus className="w-4 h-4" />
                        Request Stock
                    </button>
                    <button className="flex items-center gap-2 bg-white text-deep-green border border-light-green/30 px-4 py-2 rounded-xl text-sm font-bold hover:bg-light-green/10 transition-all">
                        <BarChart3 className="w-4 h-4" />
                        View Reports
                    </button>
                </div>
            </div>

            {/* Active Requests Section - NOW AT THE TOP */}
            {requests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-light-green/30 overflow-hidden">
                    <div className="p-6 border-b border-light-green/30 flex justify-between items-center">
                        <h3 className="font-bold text-charcoal flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-500" />
                            Active Stock Requests
                        </h3>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{requests.filter(r => r.status === 'Requested').length} New</span>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-light-green/5 text-charcoal/70">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Product</th>
                                    <th className="px-6 py-3 font-medium">Qty</th>
                                    <th className="px-6 py-3 font-medium">Status & Reason</th>
                                    <th className="px-6 py-3 font-medium">Requested At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-green/10">
                                {requests.slice(0, 5).map(request => (
                                    <tr key={request.id} className="hover:bg-light-green/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-charcoal">{request.productName}</td>
                                        <td className="px-6 py-4 text-charcoal/70">
                                            {request.modifiedQuantity || request.quantity} {request.unit}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase border w-fit ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                                {request.reason && (
                                                    <span className="text-[10px] text-red-600 font-bold truncate max-w-[150px]" title={request.reason}>
                                                        Note: {request.reason}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/50 text-xs">{request.requestedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-deep-green to-primary rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-sm font-medium">Today's Sales</p>
                            <h3 className="text-3xl font-bold mt-2">₹ 14,200</h3>
                        </div>
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-white/90">
                        <span className="font-bold">+12%</span>
                        <span className="ml-1 opacity-80">from yesterday</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-green/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-charcoal/60 text-sm font-medium">Pending Orders</p>
                            <h3 className="text-3xl font-bold text-charcoal mt-2">8</h3>
                        </div>
                        <div className="p-2 bg-light-green/20 rounded-lg text-deep-green">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-4">2 urgent deliveries</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-light-green/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-charcoal/60 text-sm font-medium">Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-charcoal mt-2">{demandingStocks.length}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-xs text-charcoal/50 mt-4">Items requiring attention</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fast Selling Stocks */}
                <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                    <div className="p-6 border-b border-light-green/30 flex justify-between items-center">
                        <h3 className="font-bold text-charcoal flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Fast Selling Items
                        </h3>
                        <span className="text-xs font-medium text-deep-green bg-light-green/20 px-2 py-1 rounded-full">High Velocity</span>
                    </div>
                    <div className="p-0">
                        {fastSelling.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-light-green/10 text-charcoal/70">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Item Name</th>
                                        <th className="px-6 py-3 font-medium">Price</th>
                                        <th className="px-6 py-3 font-medium">Run Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-green/20">
                                    {fastSelling.map(item => (
                                        <tr key={item.id} className="hover:bg-light-green/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-charcoal">{item.name}</td>
                                            <td className="px-6 py-4 text-charcoal/70">₹{item.price}</td>
                                            <td className="px-6 py-4 text-deep-green font-medium">Very High</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-charcoal/50">No fast selling data available yet.</div>
                        )}
                    </div>
                </div>

                {/* Demanding Stocks (High Demand / Low Stock) */}
                <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                    <div className="p-6 border-b border-light-green/30 flex justify-between items-center">
                        <h3 className="font-bold text-charcoal flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-deep-green" />
                            High Demand (Low Stock)
                        </h3>
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Restock Now</span>
                    </div>
                    <div className="p-0">
                        {demandingStocks.length > 0 ? (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-light-green/10 text-charcoal/70">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Item Name</th>
                                        <th className="px-6 py-3 font-medium">Stock Left</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-green/10">
                                    {demandingStocks.map(item => (
                                        <tr key={item.id} className="hover:bg-light-green/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-charcoal">{item.name}</td>
                                            <td className="px-6 py-4 text-charcoal/70">{item.quantity} {item.unit}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                    Critical
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center text-charcoal/50">Inventory looks healthy!</div>
                        )}
                    </div>
                </div>
            </div>

            <StockRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </div>
    );
}
