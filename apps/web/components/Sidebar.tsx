"use client";
import Link from "next/link";
import { LayoutDashboard, Users, Package, TrendingUp, Settings, LogOut, Store, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isOpen } = useSidebar();

  return (
    <div className={`w-64 bg-deep-green text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <Store className="w-8 h-8 text-amber-400 flex-shrink-0" />
        <span className="text-xl font-bold tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-300">Vendor AI</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-x-hidden">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          <span>Dashboard</span>
        </Link>
        <Link href="/vendors" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <Users className="w-5 h-5 flex-shrink-0" />
          <span>Vendors</span>
        </Link>
        <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <Package className="w-5 h-5 flex-shrink-0" />
          <span>Inventory</span>
        </Link>
        <Link href="/requests" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span>Stock Requests</span>
        </Link>
        <Link href="/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <TrendingUp className="w-5 h-5 flex-shrink-0" />
          <span>Analytics</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-light-green/70 hover:bg-white/10 hover:text-white transition-all group">
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-deep-green font-bold text-xs flex-shrink-0 ring-2 ring-white/20">
            {user ? user.name.charAt(0) : "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate w-32">
              {user ? user.name : "Guest"}
            </p>
            <p className="text-xs text-light-green/60 truncate w-32">
              {user ? user.email : "guest@vendorai.com"}
            </p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg text-red-100 hover:bg-red-500/20 hover:text-white transition-all group">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
