"use client";
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag, AlertTriangle, Activity } from "lucide-react";
import { useVendors } from "@/context/VendorContext";
import { useInventory } from "@/context/InventoryContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import map to avoid SSR issues with Leaflet
const DashboardMap = dynamic(() => import('@/components/DashboardMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-light-green/5 text-charcoal/40">
      <div className="flex flex-col items-center">
        <Activity className="w-8 h-8 mb-2 animate-bounce" />
        <p>Loading Map...</p>
      </div>
    </div>
  )
});

const StatCard = ({ title, value, subtext, trend, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-charcoal/60 text-sm font-medium">{title}</h2>
        <p className="text-3xl font-bold text-charcoal mt-2">{value}</p>
      </div>
      <div className="p-2 bg-light-green/20 rounded-lg text-deep-green">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs font-medium">
      {trend === 'up' ? (
        <span className="text-deep-green flex items-center bg-light-green/20 px-2 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {subtext}
        </span>
      ) : trend === 'down' ? (
        <span className="text-red-700 flex items-center bg-red-50 px-2 py-1 rounded-full">
          <ArrowDownRight className="w-3 h-3 mr-1" />
          {subtext}
        </span>
      ) : (
        <span className="text-charcoal/60 flex items-center bg-light-green/10 px-2 py-1 rounded-full">
          {subtext}
        </span>
      )}
      <span className="text-charcoal/40 ml-2">vs last month</span>
    </div>
  </div>
);

export default function Home() {
  const { vendors } = useVendors();
  const { lowStockItems, totalValue } = useInventory();
  const router = useRouter();

  // Calculate Total Sales from Vendors (parsing "₹ 12,400")
  const totalSales = vendors.reduce((acc, vendor) => {
    const amount = parseInt(vendor.sales.replace(/[^0-9]/g, '')) || 0;
    return acc + amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-charcoal/60 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          {/* Removed Download Report button as requested */}
          <button onClick={() => router.push('/vendors')} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green/90 shadow-sm shadow-deep-green/20">
            Add Vendor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vendors"
          value={vendors.length}
          subtext="+2"
          trend="up"
          icon={Users}
        />
        <StatCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          subtext="+8.2%"
          trend="up"
          icon={ShoppingBag}
        />
        <StatCard
          title="Stock Alerts"
          value={lowStockItems.length}
          subtext={lowStockItems.length > 5 ? "Critical" : "Manageable"}
          trend={lowStockItems.length > 0 ? "down" : "neutral"}
          icon={AlertTriangle}
        />
        <StatCard
          title="Inventory Value"
          value={formatCurrency(totalValue)}
          subtext="Stable"
          trend="neutral"
          icon={Activity}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Heatmap Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-light-green/30 flex flex-col h-96">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-charcoal">Live Foot Traffic Heatmap</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-deep-green rounded-full animate-pulse"></span>
              <span className="text-xs text-charcoal/60 font-medium">Live Updates</span>
            </div>
          </div>
          <div className="flex-1 bg-light-green/10 rounded-lg border border-light-green/20 overflow-hidden relative z-0">
            <DashboardMap />
          </div>
        </div>

        {/* Recent Activity / Side Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-charcoal mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex gap-4 items-start p-3 rounded-lg hover:bg-light-green/10 transition-colors border border-transparent hover:border-light-green/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {item.status === 'Out of Stock' ? `Out of Stock: ${item.name}` : `Low Stock: ${item.name}`}
                    </p>
                    <p className="text-xs text-charcoal/50 mt-1">Vendor #{item.vendorId} • {item.lastUpdated}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-charcoal/50 text-sm">No active alerts. Inventory looks good!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
