"use client";
import { useStockRequests, StockRequest } from "@/context/StockRequestContext";
import { useVendors } from "@/context/VendorContext";
import { Clock, CheckCircle2, Truck, Package, MapPin, IndianRupee, AlertCircle, Edit3, X, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function AdminRequestsPage() {
    const { requests, updateRequest } = useStockRequests();
    const { vendors } = useVendors();
    const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const [adminForm, setAdminForm] = useState({
        status: "" as StockRequest["status"],
        assignedSupplier: "",
        scheduledDeliveryDate: "",
        adminNotes: "",
        modifiedQuantity: 0,
        pricePerUnit: "",
        reason: ""
    });

    const openManageModal = (request: StockRequest) => {
        setSelectedRequest(request);
        setAdminForm({
            status: request.status === "Pending" ? "Approved" : request.status,
            assignedSupplier: request.assignedSupplier || "",
            scheduledDeliveryDate: request.scheduledDeliveryDate || "",
            adminNotes: request.adminNotes || "",
            modifiedQuantity: request.modifiedQuantity || request.quantity,
            pricePerUnit: request.pricePerUnit?.toString() || "",
            reason: request.reason || ""
        });
        setIsManageModalOpen(true);
    };

    const handleAdminSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for Reason
        if ((adminForm.status === "Modified" || adminForm.status === "Rejected") && !adminForm.reason.trim()) {
            alert(`Please provide a reason for ${adminForm.status.toLowerCase()} status.`);
            return;
        }

        if (selectedRequest) {
            updateRequest(selectedRequest.id, {
                status: adminForm.status,
                assignedSupplier: adminForm.assignedSupplier,
                scheduledDeliveryDate: adminForm.scheduledDeliveryDate,
                adminNotes: adminForm.adminNotes,
                modifiedQuantity: adminForm.modifiedQuantity,
                pricePerUnit: adminForm.pricePerUnit ? Number(adminForm.pricePerUnit) : undefined,
                reason: adminForm.reason
            });
            setIsManageModalOpen(false);
            alert("Request updated successfully!");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-amber-50 text-amber-700 border-amber-200";
            case "Approved": return "bg-green-50 text-green-700 border-green-200";
            case "Modified": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Rejected": return "bg-red-50 text-red-700 border-red-200";
            case "In Transit": return "bg-purple-50 text-purple-700 border-purple-200";
            case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Cancelled": return "bg-gray-50 text-gray-700 border-gray-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Stock Requests</h1>
                    <p className="text-charcoal/60 text-sm mt-1">Manage and fulfill inventory requests from vendors.</p>
                </div>
                <div className="flex gap-2">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {requests.filter(r => r.status === "Pending").length} New Pending
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-light-green/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-light-green/10 text-charcoal/70 border-b border-light-green/20">
                            <tr>
                                <th className="px-6 py-4 font-bold">Request ID</th>
                                <th className="px-6 py-4 font-bold">Vendor</th>
                                <th className="px-6 py-4 font-bold">Product</th>
                                <th className="px-6 py-4 font-bold">Quantity</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-green/10">
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-light-green/5 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-charcoal/60">{request.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-deep-green/60" />
                                                <span className="font-semibold text-charcoal">{request.vendorName || "Unknown Vendor"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-charcoal">{request.productName}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-charcoal/70 font-bold">{request.modifiedQuantity || request.quantity} {request.unit}</span>
                                                {request.status === "Modified" && (
                                                    <span className="text-[10px] text-blue-600 font-bold uppercase transition-all">Modified from {request.quantity}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openManageModal(request)}
                                                    className="p-2 hover:bg-deep-green hover:text-white text-deep-green rounded-lg transition-all border border-deep-green/20"
                                                    title="Manage Request"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                {request.status !== "Delivered" && (
                                                    <button
                                                        onClick={() => updateRequest(request.id, { status: "Delivered" })}
                                                        className="p-2 hover:bg-emerald-600 hover:text-white text-emerald-600 rounded-lg transition-all border border-emerald-600/20"
                                                        title="Mark as Delivered"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-charcoal/40">
                                        No stock requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manage Request Modal */}
            {isManageModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="bg-deep-green p-6 text-white flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-400" />
                                Manage Request {selectedRequest.id}
                            </h2>
                            <button onClick={() => setIsManageModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleAdminSubmit} className="p-6 space-y-5">
                            {/* ... same modal content ... */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-charcoal/40 uppercase tracking-wider">Product</label>
                                    <p className="font-bold text-charcoal">{selectedRequest.productName}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-charcoal/40 uppercase tracking-wider">Requested Qty</label>
                                    <p className="font-bold text-charcoal">{selectedRequest.quantity} {selectedRequest.unit}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">AI Recommendation</p>
                                    <p className="text-xs text-amber-800/80 leading-relaxed">
                                        Vendor current stock is low. Demand prediction suggests approving {selectedRequest.quantity} units for the next {selectedRequest.sellingPeriod}.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-light-green/10">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-charcoal block">Action / Status</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Approved", "Modified", "Rejected", "In Transit", "Delivered"].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => setAdminForm({ ...adminForm, status: status as any })}
                                                className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all ${adminForm.status === status
                                                    ? "bg-deep-green text-white border-deep-green shadow-md shadow-deep-green/20"
                                                    : "bg-white text-charcoal/60 border-light-green/20 hover:border-deep-green/30"
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {["Approved", "Modified", "In Transit", "Delivered"].includes(adminForm.status) && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-charcoal">Approved Quantity</label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={adminForm.modifiedQuantity}
                                                        onChange={(e) => setAdminForm({ ...adminForm, modifiedQuantity: Number(e.target.value) })}
                                                        className="w-full px-4 py-2 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 font-bold"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-charcoal/40">{selectedRequest.unit}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-charcoal">Price per Unit (Optional)</label>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/40" />
                                                    <input
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={adminForm.pricePerUnit}
                                                        onChange={(e) => setAdminForm({ ...adminForm, pricePerUnit: e.target.value })}
                                                        className="w-full pl-10 pr-4 py-2 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-charcoal">Assign Supplier</label>
                                            <select
                                                value={adminForm.assignedSupplier}
                                                onChange={(e) => setAdminForm({ ...adminForm, assignedSupplier: e.target.value })}
                                                className="w-full px-4 py-2 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 font-medium"
                                                required={["Approved", "Modified"].includes(adminForm.status)}
                                            >
                                                <option value="">Select a supplier</option>
                                                {vendors.map(v => (
                                                    <option key={v.id} value={v.name}>{v.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-charcoal font-bold">Expected Delivery Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                value={adminForm.scheduledDeliveryDate}
                                                onChange={(e) => setAdminForm({ ...adminForm, scheduledDeliveryDate: e.target.value })}
                                                className="w-full px-4 py-2 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 font-bold"
                                                required={["Approved", "Modified"].includes(adminForm.status)}
                                            />
                                        </div>
                                    </>
                                )}

                                {(adminForm.status === "Modified" || adminForm.status === "Rejected") && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-charcoal animate-in fade-in slide-in-from-top-2">
                                            Reason for {adminForm.status} <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={adminForm.reason}
                                            onChange={(e) => setAdminForm({ ...adminForm, reason: e.target.value })}
                                            placeholder={`Provide a short reason for ${adminForm.status.toLowerCase()} the request...`}
                                            className="w-full px-4 py-3 bg-red-50/30 border border-red-100 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 text-sm min-h-[80px]"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-charcoal">Admin Notes (Internal)</label>
                                    <textarea
                                        value={adminForm.adminNotes}
                                        onChange={(e) => setAdminForm({ ...adminForm, adminNotes: e.target.value })}
                                        placeholder="Add any internal notes here..."
                                        className="w-full px-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 text-sm min-h-[80px]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${adminForm.status === 'Rejected'
                                    ? 'bg-red-600 shadow-red-600/20 hover:bg-red-700'
                                    : 'bg-deep-green shadow-deep-green/20 hover:bg-deep-green/90'
                                    }`}
                            >
                                {adminForm.status === 'Rejected' ? <X className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                Update Request Details
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
