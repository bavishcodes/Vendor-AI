"use client";
import { LayoutDashboard, Package, LogOut, TrendingUp, Store, IndianRupee } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useLocale, useTranslations } from "next-intl";

export default function VendorSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isOpen } = useSidebar();
    const locale = useLocale();
    const t = useTranslations();

    const withLocale = (path: string) => `/${locale}${path}`;

    const links = [
        { name: t("dashboard.title"), href: withLocale("/vendor"), icon: LayoutDashboard },
        { name: t("vendor_dashboard.inventory"), href: withLocale("/vendor/inventory"), icon: Package },
        { name: t("vendor_dashboard.sales_today"), href: withLocale("/vendor/sales/entry"), icon: IndianRupee },
        { name: t("analytics.title"), href: withLocale("/vendor/sales"), icon: TrendingUp },
    ];

    return (
        <aside className={`h-screen w-64 bg-deep-green border-r border-light-green/20 fixed left-0 top-0 z-50 flex flex-col text-white transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-light-green/20 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-deep-green font-bold shadow-lg shadow-amber-400/20">
                    <Store className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                    Vendor Desk
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? "bg-light-green text-deep-green font-bold shadow-md shadow-light-green/20"
                                : "text-light-green/70 hover:bg-light-green/10 hover:text-white"
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-deep-green" : "text-amber-400 group-hover:text-amber-400"}`} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-light-green/20">
                <div className="mb-4 flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-deep-green font-bold text-xs ring-2 ring-white/20">
                        {user ? user.name.charAt(0) : "V"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate w-32">
                            {user ? user.name : t("auth.shopkeeper")}
                        </p>
                        <p className="text-xs text-light-green/60 truncate w-32">
                            {user ? user.email : "shop@vendorai.com"}
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-100 hover:bg-red-500/20 hover:text-white transition-all font-bold group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    {t("common.logout")}
                </button>
            </div>
        </aside>
    );
}
