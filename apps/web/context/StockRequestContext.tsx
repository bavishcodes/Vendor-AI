"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
    addRequest: (request: Omit<StockRequest, "id" | "requestedAt" | "status" | "vendorId">) => void;
    updateRequest: (id: string, updates: Partial<StockRequest>) => void;
}

const StockRequestContext = createContext<StockRequestContextType | undefined>(undefined);

export function StockRequestProvider({ children }: { children: ReactNode }) {
    const [requests, setRequests] = useState<StockRequest[]>([]);
    const { updateItemQuantityByName } = useInventory();

    useEffect(() => {
        const storedRequests = localStorage.getItem("vendor_ai_stock_requests");
        if (storedRequests) {
            setRequests(JSON.parse(storedRequests));
        }
    }, []);

    const addRequest = (newRequestData: Omit<StockRequest, "id" | "requestedAt" | "status" | "vendorId">) => {
        const newRequest: StockRequest = {
            id: `REQ-${Math.floor(Math.random() * 9000) + 1000}`,
            ...newRequestData,
            status: "Pending", // Match requirement: starts with Pending
            requestedAt: new Date().toLocaleString(),
            vendorId: "vendor_1",
            vendorName: "Chennai Central Store"
        };
        const updatedRequests = [newRequest, ...requests];
        setRequests(updatedRequests);
        localStorage.setItem("vendor_ai_stock_requests", JSON.stringify(updatedRequests));
    };

    const updateRequest = (id: string, updates: Partial<StockRequest>) => {
        setRequests(prev => {
            const updated = prev.map(req => {
                if (req.id === id) {
                    const newReq = { ...req, ...updates };

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
