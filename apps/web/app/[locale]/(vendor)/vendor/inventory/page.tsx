"use client";
import { useState } from "react";
import { useInventory } from "@/context/InventoryContext";
import { Search, Filter, Plus, Package, Clock, History, AlertCircle, IndianRupee } from "lucide-react";
import StockRequestModal from "@/components/StockRequestModal";
import { useStockRequests } from "@/context/StockRequestContext";

export default function VendorInventoryPage() {
    const { items } = useInventory();
    const { requests } = useStockRequests();
    const [searchTerm, setSearchTerm] = useState("");
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "Approved": return "text-green-600 bg-green-50 border-green-200";
            case "Modified": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Rejected": return "text-red-600 bg-red-50 border-red-200";
            case "Requested": return "text-amber-600 bg-amber-50 border-amber-200";
            case "In Transit": return "text-purple-600 bg-purple-50 border-purple-200";
            case "Delivered": return "text-emerald-600 bg-emerald-50 border-emerald-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">My Inventory</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Manage your shop&apos;s stock levels.</p>
                </div>
                <button
                    onClick={() => setIsRequestModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-deep-green hover:bg-deep-green/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-deep-green/20"
                >
                    <Plus className="w-4 h-4" />
                    Request Stock
                </button>
            </div>

            {/* Filters - KEPT AT THE TOP */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-light-green/30 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-light-green/5 border border-light-green/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-sm text-charcoal"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-light-green/30 rounded-lg text-charcoal/70 hover:bg-light-green/10 text-sm font-medium transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Recent Requests Section - BELOW FILTERS */}
            {requests.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-deep-green" />
                        <h2 className="text-xl font-bold text-charcoal">Recent Requests</h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-light-green/10 text-charcoal/70 border-b border-light-green/20">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Product Details</th>
                                        <th className="px-6 py-4 font-bold">Approved Qty</th>
                                        <th className="px-6 py-4 font-bold">Price / Unit</th>
                                        <th className="px-6 py-4 font-bold">Status & Updates</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-light-green/10">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="hover:bg-light-green/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-charcoal">{request.productName}</span>
                                                        <span className="text-[10px] text-charcoal/40 uppercase font-black">Requested: {request.quantity} {request.unit}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-charcoal/70 font-bold">
                                                    {request.status === "Requested" ? "Pending..." : `${request.modifiedQuantity || request.quantity} ${request.unit}`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {request.pricePerUnit ? (
                                                    <span className="flex items-center gap-1 font-bold text-deep-green">
                                                        <IndianRupee className="w-3 h-3" />
                                                        {request.pricePerUnit}
                                                    </span>
                                                ) : (
                                                    <span className="text-charcoal/30">--</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border w-fit ${getStatusStyles(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                    {request.reason && (
                                                        <div className="flex items-start gap-1 p-1.5 bg-red-50/50 rounded-lg border border-red-100">
                                                            <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-[10px] leading-tight text-red-700 font-medium">
                                                                <span className="font-bold uppercase mr-1">Admin:</span>
                                                                {request.reason}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Inventory List */}
            <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-light-green/10 text-charcoal/70 border-b border-light-green/20">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Stock Level</th>
                                <th className="px-6 py-4 font-medium">Unit Price</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-green/10">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-light-green/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-light-green/10 rounded-lg flex items-center justify-center text-deep-green group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-charcoal">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-light-green/10 text-deep-green border border-light-green/20">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${item.quantity < 20 ? "text-red-600" : "text-charcoal"}`}>
                                                    {item.quantity}
                                                </span>
                                                <span className="text-charcoal/40 text-xs">{item.unit}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-light-green/10 rounded-full mt-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.quantity < 20 ? "bg-red-500" : "bg-deep-green"}`}
                                                    style={{ width: `${Math.min(items && items.length ? (item.quantity / 100) * 100 : 50, 100)}%` }} // Mock progress
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/70">₹{item.price}</td>
                                        <td className="px-6 py-4">
                                            {item.quantity < 20 ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-deep-green bg-light-green/20 px-2 py-1 rounded-md border border-light-green/30">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-deep-green" />
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-charcoal/40">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 text-light-green/30 mb-3" />
                                            <p className="font-medium text-charcoal">No items found</p>
                                            <p className="text-sm">Try adjusting your search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <StockRequestModal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
            />
        </div>
    );
}
