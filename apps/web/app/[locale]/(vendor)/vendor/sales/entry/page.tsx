"use client";
import { useInventory } from "@/context/InventoryContext";
import { Save, Plus, Trash2, Calendar, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SalesEntry {
    id: string;
    productId: string;
    productName: string;
    quantitySold: number;
    remainingStock: number;
    price: number;
}

export default function DailySalesEntryPage() {
    const { items, updateItemStock } = useInventory();
    const [salesDate, setSalesDate] = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries] = useState<SalesEntry[]>([]);

    const addEntry = () => {
        const newEntry: SalesEntry = {
            id: Date.now().toString(),
            productId: "",
            productName: "",
            quantitySold: 1,
            remainingStock: 0,
            price: 0
        };
        setEntries([...entries, newEntry]);
    };

    const removeEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const updateEntry = (id: string, updates: Partial<SalesEntry>) => {
        setEntries(entries.map(e => {
            if (e.id === id) {
                const updated = { ...e, ...updates };
                if (updates.productId) {
                    const product = items.find(i => i.id === Number(updates.productId));
                    if (product) {
                        updated.productName = product.name;
                        updated.price = product.price;
                        // Default remaining stock = current - sold
                        updated.remainingStock = Math.max(0, product.quantity - updated.quantitySold);
                    }
                }
                return updated;
            }
            return e;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (entries.length === 0) {
            alert("Please add at least one entry.");
            return;
        }

        // Logic to update inventory based on remaining stock entered
        entries.forEach(entry => {
            if (entry.productId) {
                // Update the absolute stock with what the user entered as "remaining"
                updateItemStock(entry.productName, entry.remainingStock);
            }
        });

        alert("Daily sales and stock levels updated successfully!");
        setEntries([]);
    };

    const totalSales = entries.reduce((acc, curr) => acc + (curr.quantitySold * curr.price), 0);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Daily Sales & Stock Entry</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Log transactions and verify remaining inventory for {salesDate}.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-light-green/30 px-4">
                    <Calendar className="w-4 h-4 text-deep-green" />
                    <input
                        type="date"
                        value={salesDate}
                        onChange={(e) => setSalesDate(e.target.value)}
                        className="outline-none text-sm font-bold text-charcoal"
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-light-green/30 overflow-hidden">
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-light-green/10 text-charcoal/70 border-b border-light-green/20">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Product</th>
                                    <th className="px-6 py-4 font-bold">Sold Qty</th>
                                    <th className="px-6 py-4 font-bold">Remaining Stock</th>
                                    <th className="px-6 py-4 font-bold">Price (₹)</th>
                                    <th className="px-6 py-4 font-bold">Suggestion</th>
                                    <th className="px-6 py-4 font-bold"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-light-green/10 text-charcoal">
                                {entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-light-green/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <select
                                                value={entry.productId}
                                                onChange={(e) => updateEntry(entry.id, { productId: e.target.value })}
                                                className="w-full bg-light-green/5 border border-light-green/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-deep-green/20"
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {items.map(item => (
                                                    <option key={item.id} value={item.id}>{item.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={entry.quantitySold}
                                                onChange={(e) => updateEntry(entry.id, { quantitySold: Number(e.target.value) })}
                                                className="w-20 bg-light-green/5 border border-light-green/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-deep-green/20"
                                                required
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={entry.remainingStock}
                                                onChange={(e) => updateEntry(entry.id, { remainingStock: Number(e.target.value) })}
                                                className="w-20 bg-light-green/5 border border-light-green/20 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-deep-green/20"
                                                required
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium">₹{entry.price}</td>
                                        <td className="px-6 py-4">
                                            {entry.remainingStock < entry.quantitySold * 1.5 ? (
                                                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Restock Suggestion: {entry.quantitySold * 3} units
                                                </div>
                                            ) : (
                                                <div className="text-deep-green font-bold text-[10px] uppercase">Healthy Level</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                type="button"
                                                onClick={() => removeEntry(entry.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {entries.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-charcoal/40 italic">
                                            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-10" />
                                            No entries added. Start your daily report here.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-light-green/5 border-t border-light-green/10 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={addEntry}
                            className="text-deep-green font-bold text-sm flex items-center gap-2 hover:bg-deep-green hover:text-white px-4 py-2 rounded-xl transition-all border border-deep-green/20"
                        >
                            <Plus className="w-4 h-4" />
                            Add Row
                        </button>
                        <div className="text-right">
                            <p className="text-xs text-charcoal/40 uppercase font-bold">Daily Revenue</p>
                            <span className="text-2xl font-black text-deep-green">₹ {totalSales.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-deep-green text-white font-bold py-4 rounded-2xl shadow-lg shadow-deep-green/20 hover:bg-deep-green/90 transition-all flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Complete Daily Entry & Update Stock
                </button>
            </form>
        </div>
    );
}
