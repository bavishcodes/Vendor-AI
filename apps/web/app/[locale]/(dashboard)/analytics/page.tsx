"use client";
import { TrendingUp, Activity, BarChart2, PieChart } from "lucide-react";
import { useInventory } from "@/context/InventoryContext";
import { useStockRequests } from "@/context/StockRequestContext";
import { useVendors } from "@/context/VendorContext";
import { useMemo } from "react";

export default function AnalyticsPage() {
    const { items } = useInventory();
    const { requests } = useStockRequests();
    const { vendors } = useVendors();

    const totalRevenue = useMemo(() => items.reduce((acc, item) => acc + (item.quantity * item.price), 0), [items]);
    const avgOrderValue = useMemo(() => {
        const pricedRequests = requests.filter((request) => Number(request.pricePerUnit) > 0);
        if (pricedRequests.length === 0) {
            return 0;
        }
        const total = pricedRequests.reduce((acc, request) => acc + Number(request.pricePerUnit || 0) * (request.modifiedQuantity || request.quantity), 0);
        return total / pricedRequests.length;
    }, [requests]);

    const riskVendors = useMemo(() => vendors.filter((vendor) => vendor.status === "Warning" || vendor.status === "Inactive"), [vendors]);

    const suggestions = useMemo(() => {
        const list: string[] = [];

        const tomato = items.find((item) => item.name.toLowerCase().includes("tomato"));
        if (tomato && tomato.quantity < 50) {
            list.push("Raise order for tomatoes by 20% this week to avoid demand gaps.");
        }

        const curd = items.find((item) => item.name.toLowerCase().includes("curd"));
        if (curd && curd.price <= 50) {
            list.push("Move curd promotion due to low market price and improve conversion.");
        }

        const vendorRisk = riskVendors[0];
        if (vendorRisk) {
            list.push(`${vendorRisk.name} has repeated delay risk. Re-route urgent orders to backup suppliers.`);
        }

        if (list.length === 0) {
            list.push("Demand and supply are stable. Continue current procurement cycle.");
        }

        return list;
    }, [items, riskVendors]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Performance Analytics</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Deep dive into sales trends and AI predictions.</p>
                </div>
                <div className="flex bg-light-green/10 p-1 rounded-lg border border-light-green/20">
                    <button className="px-4 py-1.5 bg-white shadow-sm text-charcoal text-xs font-bold rounded-md border border-light-green/20">7 Days</button>
                    <button className="px-4 py-1.5 text-charcoal/60 hover:text-charcoal text-xs font-medium rounded-md transition-colors">30 Days</button>
                    <button className="px-4 py-1.5 text-charcoal/60 hover:text-charcoal text-xs font-medium rounded-md transition-colors">90 Days</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <p className="text-charcoal/40 text-xs font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-charcoal h-8">₹ {Math.round(totalRevenue).toLocaleString()}</h3>
                    <div className="flex items-center text-deep-green text-xs font-bold mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +14.2% vs last period
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <p className="text-charcoal/40 text-xs font-bold uppercase tracking-wider mb-2">Avg Order Value</p>
                    <h3 className="text-2xl font-bold text-charcoal h-8">₹ {Math.round(avgOrderValue).toLocaleString()}</h3>
                    <div className="flex items-center text-deep-green text-xs font-bold mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2.1% vs last period
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <p className="text-charcoal/40 text-xs font-bold uppercase tracking-wider mb-2">Wastage Reduction</p>
                    <h3 className="text-2xl font-bold text-charcoal h-8">18%</h3>
                    <div className="flex items-center text-deep-green text-xs font-bold mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Goal exceeded
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                    <p className="text-charcoal/40 text-xs font-bold uppercase tracking-wider mb-2">Active Vendors</p>
                    <h3 className="text-2xl font-bold text-charcoal h-8">{vendors.length}</h3>
                    <div className="flex items-center text-charcoal/60 text-xs font-bold mt-2">
                        <Activity className="w-3 h-3 mr-1" />
                        {riskVendors.length} at-risk vendors
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30">
                <h3 className="font-bold text-charcoal mb-4">Actionable Recommendations</h3>
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <div key={`${suggestion}-${index}`} className="p-3 rounded-lg bg-light-green/5 border border-light-green/20 text-sm text-charcoal">
                            {suggestion}
                        </div>
                    ))}
                </div>
            </div>

            {/* Major Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-light-green/30 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-charcoal flex items-center gap-2">
                            <BarChart2 className="w-5 h-5 text-deep-green" />
                            Sales Overview
                        </h3>
                    </div>
                    {/* Chart Placeholder */}
                    <div className="flex-1 bg-light-green/5 rounded-lg border border-dashed border-light-green/30 flex items-center justify-center relative overflow-hidden group">
                        <div className="flex items-end gap-3 h-32 opacity-30 absolute bottom-10">
                            <div className="w-8 bg-deep-green/30 h-20 rounded-t-sm"></div>
                            <div className="w-8 bg-deep-green/50 h-32 rounded-t-sm"></div>
                            <div className="w-8 bg-deep-green/30 h-24 rounded-t-sm"></div>
                            <div className="w-8 bg-deep-green h-40 rounded-t-sm shadow-xl shadow-deep-green/20"></div>
                            <div className="w-8 bg-deep-green/30 h-28 rounded-t-sm"></div>
                            <div className="w-8 bg-deep-green/50 h-36 rounded-t-sm"></div>
                            <div className="w-8 bg-deep-green/30 h-24 rounded-t-sm"></div>
                        </div>
                        <span className="relative z-10 bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold text-charcoal/60 border border-light-green/20">Chart Visualization (Recharts/Chart.js)</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-charcoal flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-deep-green" />
                            Category Mix
                        </h3>
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="w-48 h-48 rounded-full border-8 border-light-green/10 border-t-deep-green border-r-deep-green/60 p-8 flex items-center justify-center bg-light-green/5 relative shadow-inner">
                            <span className="text-2xl font-bold text-charcoal">45%</span>
                        </div>
                        <div className="mt-6 flex gap-4 text-xs font-bold text-charcoal/60">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-deep-green rounded-full"></span> Vegetables
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-deep-green/60 rounded-full"></span> Fruits
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-light-green/30 rounded-full border border-light-green/40"></span> Others
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
