"use client";
import React from "react";
import { TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, ShoppingBag } from "lucide-react";

export default function VendorSalesPage() {
    // Mock Data for Sales
    const salesStats = [
        { label: "Total Revenue", value: "₹ 45,231", change: "+20.1%", trend: "up", icon: DollarSign },
        { label: "Orders", value: "356", change: "+12.5%", trend: "up", icon: ShoppingBag },
        { label: "Average Order", value: "₹ 127", change: "-2.4%", trend: "down", icon: CreditCard },
    ];

    const recentTransactions = [
        { id: "ORD-7782", customer: "Walk-in Customer", items: "Maggi Noodles, Coke", amount: "₹ 145", status: "Completed", time: "10:24 AM" },
        { id: "ORD-7781", customer: "Walk-in Customer", items: "Dairy Milk Silk", amount: "₹ 80", status: "Completed", time: "10:12 AM" },
        { id: "ORD-7780", customer: "Online Order", items: "Fortune Oil 1L", amount: "₹ 165", status: "Pending", time: "09:56 AM" },
        { id: "ORD-7779", customer: "Walk-in Customer", items: "Bread, Eggs, Milk", amount: "₹ 112", status: "Completed", time: "09:45 AM" },
        { id: "ORD-7778", customer: "Walk-in Customer", items: "Colgate Toothpaste", amount: "₹ 95", status: "Completed", time: "09:30 AM" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Sales Reports</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Track your daily performance and revenue.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-light-green/30 px-4 py-2 rounded-xl text-sm font-medium text-charcoal/70 hover:bg-light-green/10 transition-colors shadow-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Today: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {salesStats.map((stat, index) => {
                    const Icon = stat.icon;
                    const isUp = stat.trend === "up";
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-light-green/30">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-light-green/20 text-deep-green">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${isUp ? 'text-deep-green bg-light-green/20' : 'text-red-700 bg-red-50'}`}>
                                    {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                    {stat.change}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-charcoal">{stat.value}</h3>
                                <p className="text-charcoal/60 text-sm font-medium mt-1">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Transactions & Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                    <div className="p-6 border-b border-light-green/30 flex justify-between items-center">
                        <h3 className="font-bold text-charcoal">Recent Transactions</h3>
                        <a href="#" className="text-sm text-deep-green font-medium hover:text-deep-green/80">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-light-green/10 text-charcoal/70">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Order ID</th>
                                    <th className="px-6 py-3 font-medium">Items</th>
                                    <th className="px-6 py-3 font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-green/10">
                                {recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-light-green/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-charcoal">{tx.id}</span>
                                            <div className="text-xs text-charcoal/40 mt-0.5">{tx.time}</div>
                                        </td>
                                        <td className="px-6 py-4 text-charcoal/70 max-w-xs truncate">{tx.items}</td>
                                        <td className="px-6 py-4 font-medium text-charcoal">{tx.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'Completed'
                                                ? 'bg-light-green/20 text-deep-green'
                                                : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Items (Mini) */}
                <div className="bg-deep-green rounded-xl shadow-lg border border-light-green/20 text-white p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Top Performers</h3>
                            <p className="text-light-green/70 text-xs">Based on volume today</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: "Maggi Noodles", sold: 124, revenue: "₹ 1,736" },
                            { name: "Amul Milk 500ml", sold: 98, revenue: "₹ 2,940" },
                            { name: "Classic Bread", sold: 85, revenue: "₹ 2,125" },
                            { name: "Coke 250ml", sold: 67, revenue: "₹ 1,340" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div>
                                    <div className="font-medium text-sm">{item.name}</div>
                                    <div className="text-xs text-light-green/50">{item.sold} sold</div>
                                </div>
                                <div className="font-bold text-sm text-amber-400">{item.revenue}</div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-6 py-2.5 rounded-lg bg-white text-deep-green hover:bg-light-green transition-colors text-sm font-bold">
                        View Full Report
                    </button>
                </div>
            </div>
        </div>
    );
}
