"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface InventoryItem {
    id: number;
    name: string;
    vendorId: number;
    quantity: number;
    unit: string;
    price: number;
    category: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    lastUpdated: string;
}

interface InventoryContextType {
    items: InventoryItem[];
    addItem: (item: Omit<InventoryItem, "id" | "lastUpdated">) => void;
    updateItemQuantity: (id: number, quantityChange: number) => void;
    updateItemQuantityByName: (name: string, quantityChange: number) => void;
    updateItemStock: (productName: string, absoluteQuantity: number) => void;
    lowStockItems: InventoryItem[];
    totalValue: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const defaultInventory: InventoryItem[] = [
    { id: 201, name: "Tomato (Hybrid)", vendorId: 101, quantity: 45, unit: "kg", price: 24, category: "Vegetables", status: "In Stock", lastUpdated: "2 mins ago" },
    { id: 202, name: "Potatoes", vendorId: 101, quantity: 120, unit: "kg", price: 18, category: "Vegetables", status: "In Stock", lastUpdated: "5 mins ago" },
    { id: 203, name: "Onions (Red)", vendorId: 102, quantity: 12, unit: "kg", price: 35, category: "Vegetables", status: "Low Stock", lastUpdated: "10 mins ago" },
    { id: 204, name: "Apples (Fuji)", vendorId: 102, quantity: 5, unit: "kg", price: 180, category: "Fruits", status: "Low Stock", lastUpdated: "1 hour ago" },
    { id: 205, name: "Milk (1L Pack)", vendorId: 104, quantity: 0, unit: "pack", price: 55, category: "Dairy", status: "Out of Stock", lastUpdated: "2 hours ago" },
    { id: 206, name: "Rice (Basmati)", vendorId: 105, quantity: 250, unit: "kg", price: 110, category: "Grains", status: "In Stock", lastUpdated: "30 mins ago" },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<InventoryItem[]>(defaultInventory);

    useEffect(() => {
        const storedInventory = localStorage.getItem("vendor_ai_inventory");
        if (storedInventory) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setItems(JSON.parse(storedInventory));
        }
    }, []);

    const getStatus = (qty: number): InventoryItem["status"] => {
        if (qty <= 0) return "Out of Stock";
        if (qty < 20) return "Low Stock";
        return "In Stock";
    };

    const addItem = (newItemData: Omit<InventoryItem, "id" | "lastUpdated">) => {
        const newItem: InventoryItem = {
            id: Math.floor(Math.random() * 9000) + 2000,
            ...newItemData,
            lastUpdated: "Just now"
        };
        const updatedItems = [newItem, ...items];
        setItems(updatedItems);
        localStorage.setItem("vendor_ai_inventory", JSON.stringify(updatedItems));
    };

    const updateItemQuantity = (id: number, quantityChange: number) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                const newQty = Math.max(0, item.quantity + quantityChange);
                return {
                    ...item,
                    quantity: newQty,
                    status: getStatus(newQty),
                    lastUpdated: "Just now"
                };
            }
            return item;
        });
        setItems(updatedItems);
        localStorage.setItem("vendor_ai_inventory", JSON.stringify(updatedItems));
    };

    const updateItemQuantityByName = (name: string, quantityChange: number) => {
        const updatedItems = items.map(item => {
            if (item.name === name) {
                const newQty = Math.max(0, item.quantity + quantityChange);
                return {
                    ...item,
                    quantity: newQty,
                    status: getStatus(newQty),
                    lastUpdated: "Just now"
                };
            }
            return item;
        });
        setItems(updatedItems);
        localStorage.setItem("vendor_ai_inventory", JSON.stringify(updatedItems));
    };

    const updateItemStock = (productName: string, absoluteQuantity: number) => {
        const updatedItems = items.map(item => {
            if (item.name === productName) {
                return {
                    ...item,
                    quantity: absoluteQuantity,
                    status: getStatus(absoluteQuantity),
                    lastUpdated: "Just now"
                };
            }
            return item;
        });
        setItems(updatedItems);
        localStorage.setItem("vendor_ai_inventory", JSON.stringify(updatedItems));
    };

    const lowStockItems = items.filter(item => item.status === "Low Stock" || item.status === "Out of Stock");
    const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return (
        <InventoryContext.Provider value={{ items, addItem, updateItemQuantity, updateItemQuantityByName, updateItemStock, lowStockItems, totalValue }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventory() {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error("useInventory must be used within an InventoryProvider");
    }
    return context;
}
