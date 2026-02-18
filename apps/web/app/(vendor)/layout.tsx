"use client";
import VendorSidebar from "@/components/VendorSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function VendorLayoutContent({ children }: { children: React.ReactNode }) {
    const { isOpen, toggleSidebar } = useSidebar();

    return (
        <div className="flex w-full min-h-screen bg-light-green/5 overflow-x-hidden">
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <VendorSidebar />

            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "ml-64" : "ml-0"}`}>
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <VendorLayoutContent>{children}</VendorLayoutContent>
        </SidebarProvider>
    );
}
