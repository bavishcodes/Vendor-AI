"use client";
import { Plus, Search, Filter, MoreVertical, X, Trash2 } from "lucide-react";
import { useVendors, Vendor } from "@/context/VendorContext";
import { useState, FormEvent } from "react";

export default function VendorsPage() {
    const { vendors, addVendor, deleteVendor } = useVendors();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVendor, setNewVendor] = useState({
        name: "",
        ownerName: "",
        phone: "",
        category: "Vegetable vendors",
        location: ""
    });

    const handleAddVendor = (e: FormEvent) => {
        e.preventDefault();
        addVendor({
            name: newVendor.name,
            ownerName: newVendor.ownerName,
            phone: newVendor.phone,
            category: newVendor.category,
            location: newVendor.location
        });
        setNewVendor({ name: "", ownerName: "", phone: "", category: "Vegetable vendors", location: "" });
        setIsModalOpen(false);
    };

    const handleDeleteVendor = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            deleteVendor(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Vendors</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Manage your suppliers and track performance.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-deep-green hover:bg-deep-green/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-deep-green/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Vendor
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-charcoal">Add New Vendor</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-charcoal/40 hover:text-charcoal/60">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddVendor} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Shop Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-light-green/30 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal placeholder:text-charcoal/30"
                                        placeholder="e.g. Fresh Farms Ltd."
                                        value={newVendor.name}
                                        onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Owner Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-light-green/30 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal placeholder:text-charcoal/30"
                                        placeholder="e.g. Raju Kumar"
                                        value={newVendor.ownerName}
                                        onChange={(e) => setNewVendor({ ...newVendor, ownerName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-light-green/30 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal placeholder:text-charcoal/30"
                                        placeholder="+91 98765..."
                                        value={newVendor.phone}
                                        onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Category</label>
                                    <select
                                        className="w-full px-4 py-2 border border-light-green/30 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 text-charcoal bg-white focus:border-deep-green"
                                        value={newVendor.category}
                                        onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                                    >
                                        <option value="Vegetable vendors">Vegetable vendors</option>
                                        <option value="Fruit vendors">Fruit vendors</option>
                                        <option value="Flower sellers">Flower sellers</option>
                                        <option value="Street food vendors">Street food vendors</option>
                                        <option value="Tea and coffee sellers">Tea and coffee sellers</option>
                                        <option value="Milk and dairy vendors">Milk and dairy vendors</option>
                                        <option value="Fish vendors">Fish vendors</option>
                                        <option value="Meat and poultry sellers">Meat and poultry sellers</option>
                                        <option value="Grocery vendors">Grocery vendors</option>
                                        <option value="Juice and ice cream vendors">Juice and ice cream vendors</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Location</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-light-green/30 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal placeholder:text-charcoal/30"
                                        placeholder="e.g. Indiranagar"
                                        value={newVendor.location}
                                        onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-charcoal/60 hover:bg-light-green/10 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-deep-green hover:bg-deep-green/90 text-white rounded-lg font-medium transition-colors shadow-lg shadow-deep-green/20"
                                >
                                    Add Vendor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                <div className="p-4 border-b border-light-green/30 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            className="w-full pl-10 pr-4 py-2 bg-light-green/5 border border-light-green/20 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 text-sm text-charcoal placeholder:text-charcoal/30 focus:border-deep-green"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 border border-light-green/30 rounded-lg text-sm font-medium text-charcoal/70 hover:bg-light-green/10">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-light-green/10 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Vendor Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Total Sales</th>
                                <th className="px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-green/10">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-light-green/5 transition-colors border-b border-light-green/10 last:border-0">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-light-green/20 flex items-center justify-center text-deep-green font-bold text-xs border border-light-green/30">
                                                {vendor.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-charcoal">{vendor.name}</p>
                                                <p className="text-xs text-charcoal/50">{vendor.ownerName} • {vendor.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-charcoal/70">
                                        <div>{vendor.location}</div>
                                        <div className="text-xs text-charcoal/40">{vendor.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-charcoal">{vendor.sales}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${vendor.status === 'Active' ? 'bg-deep-green/10 text-deep-green border border-deep-green/20' :
                                            vendor.status === 'Warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                                'bg-light-green/10 text-charcoal/60 border border-light-green/20'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                                                className="text-charcoal/40 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                                title="Delete Vendor"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="text-charcoal/40 hover:text-deep-green transition-colors p-1 rounded-md hover:bg-light-green/10">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-light-green/30 flex items-center justify-between text-sm text-charcoal/50 bg-light-green/5">
                    <div>Showing {vendors.length} vendors</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-light-green/30 rounded disabled:opacity-30 disabled:cursor-not-allowed" disabled>Previous</button>
                        <button className="px-3 py-1 border border-light-green/30 rounded hover:bg-light-green/20 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
