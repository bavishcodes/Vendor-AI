import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vendor AI - Smart Inventory Management",
  description: "Advanced AI-driven inventory and sales tracking system.",
};

import { AuthProvider } from "@/context/AuthContext";
import { StockRequestProvider } from "@/context/StockRequestContext";
import { InventoryProvider } from "@/context/InventoryContext";
import { VendorProvider } from "@/context/VendorContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-charcoal`}
      >
        <AuthProvider>
          <VendorProvider>
            <InventoryProvider>
              <StockRequestProvider>
                {children}
              </StockRequestProvider>
            </InventoryProvider>
          </VendorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
