"use client";
import { ArrowUpRight, ArrowDownRight, Users, ShoppingBag, AlertTriangle, Activity, Settings2 } from "lucide-react";
import { useVendors } from "@/context/VendorContext";
import { useInventory } from "@/context/InventoryContext";
import { useStockRequests } from "@/context/StockRequestContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

type StatCardProps = {
  title: string;
  value: string | number;
  subtext: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
};

const StatCard = ({ title, value, subtext, trend, icon: Icon, onClick }: StatCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 hover:shadow-md transition-shadow text-left w-full disabled:cursor-default disabled:hover:shadow-sm"
  >
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
  </button>
);

export default function Home() {
  const { vendors } = useVendors();
  const { lowStockItems, totalValue } = useInventory();
  const { requests } = useStockRequests();
  const router = useRouter();
  const locale = useLocale();
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const [widgets, setWidgets] = useState({
    vendorStats: true,
    salesStats: true,
    stockAlerts: true,
    inventoryValue: true,
    riskPanel: true,
    heatmap: true,
    recentAlerts: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin_dashboard_widgets");
    if (saved) {
      setWidgets({ ...widgets, ...JSON.parse(saved) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("admin_dashboard_widgets", JSON.stringify(widgets));
  }, [widgets]);

  // Calculate Total Sales from Vendors (parsing "₹ 12,400")
  const totalSales = vendors.reduce((acc, vendor) => {
    const amount = parseInt(vendor.sales.replace(/[^0-9]/g, '')) || 0;
    return acc + amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(amount);
  };

  const pendingApprovals = requests.filter((request) => request.status === "Pending" || request.status === "Requested").length;
  const todayEscalations = requests.filter((request) => {
    const sameDay = new Date(request.lastActionAt).toDateString() === new Date().toDateString();
    return sameDay && (request.status === "Rejected" || request.status === "Cancelled");
  }).length;
  const topRiskVendors = vendors.filter((vendor) => vendor.status === "Warning" || vendor.status === "Inactive").slice(0, 3);

  const widgetItems = [
    { key: "vendorStats", label: "Total Vendors" },
    { key: "salesStats", label: "Total Sales" },
    { key: "stockAlerts", label: "Stock Alerts" },
    { key: "inventoryValue", label: "Inventory Value" },
    { key: "riskPanel", label: "Risk & Escalation" },
    { key: "heatmap", label: "Footfall Heatmap" },
    { key: "recentAlerts", label: "Recent Alerts" },
  ] as const;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-charcoal/60 text-sm mt-1">Welcome back, here is what is happening today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowWidgetConfig((prev) => !prev)} className="px-4 py-2 bg-white border border-light-green/30 text-charcoal text-sm font-medium rounded-lg hover:bg-light-green/10 inline-flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Configure Widgets
          </button>
          {/* Removed Download Report button as requested */}
          <button onClick={() => router.push('/vendors')} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green/90 shadow-sm shadow-deep-green/20">
            Add Vendor
          </button>
        </div>
      </div>

      {showWidgetConfig && (
        <div className="bg-white border border-light-green/30 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {widgetItems.map((item) => (
            <label key={item.key} className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={widgets[item.key]}
                onChange={() => setWidgets((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                className="w-4 h-4"
              />
              {item.label}
            </label>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.vendorStats && (
          <StatCard
            title="Total Vendors"
            value={vendors.length}
            subtext="+2"
            trend="up"
            icon={Users}
            onClick={() => router.push(`/${locale}/vendors`)}
          />
        )}
        {widgets.salesStats && (
          <StatCard
            title="Total Sales"
            value={formatCurrency(totalSales)}
            subtext="+8.2%"
            trend="up"
            icon={ShoppingBag}
            onClick={() => router.push(`/${locale}/analytics`)}
          />
        )}
        {widgets.stockAlerts && (
          <StatCard
            title="Stock Alerts"
            value={lowStockItems.length}
            subtext={lowStockItems.length > 5 ? "Critical" : "Manageable"}
            trend={lowStockItems.length > 0 ? "down" : "neutral"}
            icon={AlertTriangle}
            onClick={() => router.push(`/${locale}/inventory`)}
          />
        )}
        {widgets.inventoryValue && (
          <StatCard
            title="Inventory Value"
            value={formatCurrency(totalValue)}
            subtext="Stable"
            trend="neutral"
            icon={Activity}
            onClick={() => router.push(`/${locale}/inventory`)}
          />
        )}
      </div>

      {widgets.riskPanel && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <button
            type="button"
            onClick={() => router.push(`/${locale}/requests?status=Rejected`)}
            className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 text-left hover:shadow-md hover:border-deep-green/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-deep-green/20"
          >
            <p className="text-sm text-charcoal/60 font-medium">Pending Approvals</p>
            <p className="text-3xl font-bold text-charcoal mt-2">{pendingApprovals}</p>
            <p className="text-sm text-charcoal/60 mt-2">Requests waiting admin action</p>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/requests`)}
            className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 text-left hover:shadow-md hover:border-deep-green/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-deep-green/20"
          >
            <p className="text-sm text-charcoal/60 font-medium">Today&apos;s Escalations</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{todayEscalations}</p>
            <p className="text-sm text-charcoal/60 mt-2">Rejected or cancelled issues today</p>
          </button>
          <button
            type="button"
            onClick={() => router.push(`/${locale}/vendors`)}
            className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 text-left hover:shadow-md hover:border-deep-green/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-deep-green/20"
          >
            <p className="text-sm text-charcoal/60 font-medium">Top Risk Vendors</p>
            <div className="mt-2 space-y-2">
              {topRiskVendors.length > 0 ? topRiskVendors.map((vendor) => (
                <p key={vendor.id} className="text-sm text-charcoal"><span className="font-semibold">{vendor.name}</span> - {vendor.status}</p>
              )) : <p className="text-sm text-charcoal/60">No risk vendors today</p>}
            </div>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Heatmap Section */}
        {widgets.heatmap && <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-light-green/30 flex flex-col h-96">
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
        </div>}

        {/* Recent Activity / Side Panel */}
        {widgets.recentAlerts && <div className="bg-white p-6 rounded-xl shadow-sm border border-light-green/30 h-96 overflow-y-auto">
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
        </div>}
      </div>
    </div>
  );
}
