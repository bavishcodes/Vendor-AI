"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface Vendor {
    id: number;
    name: string; // This will represent Shop Name
    ownerName: string;
    phone: string;
    category: string;
    location: string;
    sales: string;
    status: "Active" | "Inactive" | "Warning";
}

interface VendorContextType {
    vendors: Vendor[];
    addVendor: (vendor: Omit<Vendor, "id" | "status" | "sales">) => void;
    deleteVendor: (id: number) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

const defaultVendors: Vendor[] = [
    { id: 101, name: "Raju Vegetables", ownerName: "Raju Kumar", phone: "+91 98765 43210", category: "Vegetable vendors", location: "T. Nagar, Chennai", sales: "₹ 12,400", status: "Active" },
    { id: 102, name: "Lakshmi Fruits", ownerName: "Lakshmi Devi", phone: "+91 98765 43211", category: "Fruit vendors", location: "Adyar, Chennai", sales: "₹ 8,900", status: "Active" },
    { id: 103, name: "Fresh Greens", ownerName: "Suresh Reddy", phone: "+91 98765 43212", category: "Vegetable vendors", location: "Anna Nagar, Chennai", sales: "₹ 15,200", status: "Warning" },
    { id: 104, name: "Daily Mart", ownerName: "Amit Shah", phone: "+91 98765 43213", category: "Grocery vendors", location: "Mylapore, Chennai", sales: "₹ 6,500", status: "Inactive" },
    { id: 105, name: "Organic Basket", ownerName: "Priya Singh", phone: "+91 98765 43214", category: "Grocery vendors", location: "Velachery, Chennai", sales: "₹ 21,000", status: "Active" },
];

export function VendorProvider({ children }: { children: ReactNode }) {
    const [vendors, setVendors] = useState<Vendor[]>(defaultVendors);

    useEffect(() => {
        const storedVendors = localStorage.getItem("vendor_ai_vendors");
        if (storedVendors) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVendors(JSON.parse(storedVendors));
        }
    }, []);

    const addVendor = (newVendorData: Omit<Vendor, "id" | "status" | "sales">) => {
        const newVendor: Vendor = {
            id: Math.floor(Math.random() * 9000) + 1000, // Random ID
            ...newVendorData,
            sales: "₹ 0", // Default sales for new vendor
            status: "Active" // Default status
        };

        const updatedVendors = [newVendor, ...vendors];
        setVendors(updatedVendors);
        localStorage.setItem("vendor_ai_vendors", JSON.stringify(updatedVendors));
    };

    const deleteVendor = (id: number) => {
        const updatedVendors = vendors.filter(vendor => vendor.id !== id);
        setVendors(updatedVendors);
        localStorage.setItem("vendor_ai_vendors", JSON.stringify(updatedVendors));
    };

    return (
        <VendorContext.Provider value={{ vendors, addVendor, deleteVendor }}>
            {children}
        </VendorContext.Provider>
    );
}

export function useVendors() {
    const context = useContext(VendorContext);
    if (context === undefined) {
        throw new Error("useVendors must be used within a VendorProvider");
    }
    return context;
}
