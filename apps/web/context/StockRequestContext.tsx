"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useInventory } from "./InventoryContext";

export interface StockRequest {
    id: string;
    productName: string;
    quantity: number;
    unit: string;
    deliveryDateTime: string;
    currentStock: number;
    sellingPeriod: string;
    preferredSupplier: string;
    maxPrice: number | string;
    status: "Requested" | "Pending" | "Approved" | "Modified" | "Rejected" | "In Transit" | "Delivered" | "Cancelled";
    requestedAt: string;
    createdAt: string;
    assignedAt?: string;
    deliveredAt?: string;
    lastAction: string;
    lastActionAt: string;
    handledBy?: string;
    slaHours: number;
    vendorId: string;
    vendorName?: string;
    // Admin action fields
    assignedSupplier?: string;
    scheduledDeliveryDate?: string;
    adminNotes?: string;
    modifiedQuantity?: number;
    pricePerUnit?: number;
    reason?: string;
}

interface StockRequestContextType {
    requests: StockRequest[];
    addRequest: (request: Omit<StockRequest, "id" | "requestedAt" | "createdAt" | "assignedAt" | "deliveredAt" | "lastAction" | "lastActionAt" | "handledBy" | "slaHours" | "status" | "vendorId">) => void;
    updateRequest: (id: string, updates: Partial<StockRequest>) => void;
}

const StockRequestContext = createContext<StockRequestContextType | undefined>(undefined);

export function StockRequestProvider({ children }: { children: ReactNode }) {
    const [requests, setRequests] = useState<StockRequest[]>([]);
    const { updateItemQuantityByName } = useInventory();

    useEffect(() => {
        const storedRequests = localStorage.getItem("vendor_ai_stock_requests");
        if (storedRequests) {
            const parsed: StockRequest[] = JSON.parse(storedRequests);
            const normalized = parsed.map((request) => {
                const createdAt = request.createdAt ?? new Date(request.requestedAt || Date.now()).toISOString();
                return {
                    ...request,
                    createdAt,
                    requestedAt: request.requestedAt ?? new Date(createdAt).toLocaleString(),
                    lastAction: request.lastAction ?? "Request created",
                    lastActionAt: request.lastActionAt ?? createdAt,
                    slaHours: request.slaHours ?? 24,
                };
            });
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRequests(normalized);
        }
    }, []);

    const addRequest = (newRequestData: Omit<StockRequest, "id" | "requestedAt" | "createdAt" | "assignedAt" | "deliveredAt" | "lastAction" | "lastActionAt" | "handledBy" | "slaHours" | "status" | "vendorId">) => {
        const createdAt = new Date().toISOString();
        const newRequest: StockRequest = {
            id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
            ...newRequestData,
            status: "Pending", // Match requirement: starts with Pending
            createdAt,
            requestedAt: new Date(createdAt).toLocaleString(),
            lastAction: "Request created",
            lastActionAt: createdAt,
            slaHours: 24,
            vendorId: "vendor_1",
            vendorName: "Chennai Central Store"
        };
        const updatedRequests = [newRequest, ...requests];
        setRequests(updatedRequests);
        localStorage.setItem("vendor_ai_stock_requests", JSON.stringify(updatedRequests));
    };

    const updateRequest = (id: string, updates: Partial<StockRequest>) => {
        setRequests(prev => {
            const now = new Date().toISOString();
            const updated = prev.map(req => {
                if (req.id === id) {
                    const nextStatus = updates.status ?? req.status;
                    const nextAssignedAt = updates.assignedSupplier && !req.assignedAt ? now : req.assignedAt;
                    const nextDeliveredAt = nextStatus === "Delivered" && !req.deliveredAt ? now : req.deliveredAt;

                    const actionLabel = updates.lastAction ?? (updates.status ? `Status changed to ${updates.status}` : "Request updated");
                    const actionTime = updates.lastActionAt ?? now;

                    const newReq = {
                        ...req,
                        ...updates,
                        status: nextStatus,
                        assignedAt: nextAssignedAt,
                        deliveredAt: nextDeliveredAt,
                        lastAction: actionLabel,
                        lastActionAt: actionTime,
                    };

                    // IF marked as Delivered, update the main inventory!
                    if (updates.status === "Delivered" && req.status !== "Delivered") {
                        const qtyToAdd = newReq.modifiedQuantity || newReq.quantity;
                        updateItemQuantityByName(newReq.productName, qtyToAdd);
                    }

                    return newReq;
                }
                return req;
            });
            localStorage.setItem("vendor_ai_stock_requests", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <StockRequestContext.Provider value={{ requests, addRequest, updateRequest }}>
            {children}
        </StockRequestContext.Provider>
    );
}

export function useStockRequests() {
    const context = useContext(StockRequestContext);
    if (context === undefined) {
        throw new Error("useStockRequests must be used within a StockRequestProvider");
    }
    return context;
}
