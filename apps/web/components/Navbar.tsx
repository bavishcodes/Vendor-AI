"use client";
import { Bell, User, Menu, Moon, Sun, TriangleAlert, CircleDot, Globe } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useTheme } from "@/context/ThemeContext";
import { useInventory } from "@/context/InventoryContext";
import { useStockRequests } from "@/context/StockRequestContext";
import { useVendors } from "@/context/VendorContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type NotificationItem = {
    id: string;
    title: string;
    detail: string;
    priority: "high" | "medium";
};

const SUPPORTED_LOCALES = ["en", "hi", "ta", "te", "kn"] as const;

const Navbar = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();
    const { theme, toggleTheme } = useTheme();
    const { items, lowStockItems } = useInventory();
    const { requests } = useStockRequests();
    const { vendors } = useVendors();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const languageRef = useRef<HTMLDivElement | null>(null);
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations();

    const handleChangeLanguage = (newLocale: string) => {
        // Store preference in localStorage
        localStorage.setItem("vendor-ai-locale", newLocale);
        // Replace the locale segment safely without duplicating path prefixes.
        const pathname = window.location.pathname;
        const segments = pathname.split("/").filter(Boolean);
        const hasLocalePrefix = segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as (typeof SUPPORTED_LOCALES)[number]);
        const restPath = hasLocalePrefix ? segments.slice(1) : segments;
        const newPathname = `/${[newLocale, ...restPath].join("/")}`;
        router.push(newPathname);
        setIsLanguageOpen(false);
    };

    useEffect(() => {
        const storedLocale = localStorage.getItem("vendor-ai-locale");
        if (!storedLocale || storedLocale === locale || !SUPPORTED_LOCALES.includes(storedLocale as (typeof SUPPORTED_LOCALES)[number])) {
            return;
        }

        const pathname = window.location.pathname;
        const segments = pathname.split("/").filter(Boolean);
        const hasLocalePrefix = segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0] as (typeof SUPPORTED_LOCALES)[number]);
        const restPath = hasLocalePrefix ? segments.slice(1) : segments;
        router.replace(`/${[storedLocale, ...restPath].join("/")}`);
    }, [locale, router]);


    const languages = [
        { code: "en", nativeLabel: "English" },
        { code: "hi", nativeLabel: "हिन्दी" },
        { code: "ta", nativeLabel: "தமிழ்" },
        { code: "te", nativeLabel: "తెలుగు" },
        { code: "kn", nativeLabel: "ಕನ್ನಡ" },
    ];

    const notifications = useMemo<NotificationItem[]>(() => {
        const now = new Date();

        if (user?.role === "vendor") {
            const veggieHikeItems = items
                .filter((item) => item.category.toLowerCase().includes("vegetable") && item.price >= 50)
                .map((item) => item.name)
                .slice(0, 3);

            const curdDeals = items.filter((item) => item.name.toLowerCase().includes("curd") && item.price <= 50);

            const delayedSuppliers = requests.filter((request) => {
                if (request.status !== "In Transit" || !request.scheduledDeliveryDate) {
                    return false;
                }
                return new Date(request.scheduledDeliveryDate) < now;
            });

            const fastSellingItems = items.filter((item) => item.price > 50 && item.quantity < 25).slice(0, 3);

            const dynamicVendorNotifications: NotificationItem[] = [];

            if (lowStockItems.length > 0) {
                dynamicVendorNotifications.push({
                    id: "vendor-low-stock",
                    title: t("notifications.stock_alert"),
                    detail: `${lowStockItems.length} ${t("notifications.low_stock", { item: "" }).trim()}`,
                    priority: "high",
                });
            }

            dynamicVendorNotifications.push({
                id: "vendor-price-hike",
                title: t("notifications.price_hike", { item: "Vegetables" }),
                detail: veggieHikeItems.length > 0
                    ? `${veggieHikeItems.join(", ")} are showing high rates today.`
                    : "Monitor wholesale vegetable rates before placing bulk orders.",
                priority: veggieHikeItems.length > 0 ? "high" : "medium",
            });

            dynamicVendorNotifications.push({
                id: "vendor-curd",
                title: t("notifications.fast_selling", { item: "Curd" }),
                detail: curdDeals.length > 0
                    ? `Curd is currently at a low price. Consider running combo offers today.`
                    : "Curd price trend is stable; watch for dip opportunities this week.",
                priority: "medium",
            });

            if (delayedSuppliers.length > 0) {
                dynamicVendorNotifications.push({
                    id: "vendor-delay",
                    title: t("notifications.delivery_alert"),
                    detail: `${delayedSuppliers.length} in-transit request(s) crossed the expected delivery time.`,
                    priority: "high",
                });
            }

            if (fastSellingItems.length > 0) {
                dynamicVendorNotifications.push({
                    id: "vendor-fast-selling",
                    title: t("notifications.fast_selling", { item: "Items" }),
                    detail: `${fastSellingItems.map((item) => item.name).join(", ")} are moving fast; consider advance restocking.`,
                    priority: "medium",
                });
            }

            return dynamicVendorNotifications.slice(0, 5);
        }

        const pendingApprovals = requests.filter((request) => request.status === "Pending" || request.status === "Requested").length;
        const waitingVendors = vendors.filter((vendor) => vendor.status === "Inactive").length;
        const raisedProblems = requests.filter((request) => request.status === "Rejected" || request.status === "Modified").length;
        const unresolvedQueries = requests.filter((request) => Boolean(request.reason) && request.status !== "Delivered").length;
        const escalationsToday = requests.filter((request) => {
            const actionAt = new Date(request.lastActionAt);
            return actionAt.toDateString() === now.toDateString() && (request.status === "Rejected" || request.status === "Cancelled");
        }).length;

        return [
            {
                id: "admin-pending",
                title: t("notifications.pending_approval"),
                detail: `${pendingApprovals} stock request(s) are pending approval.`,
                priority: pendingApprovals > 3 ? "high" : "medium",
            },
            {
                id: "admin-waiting",
                title: t("notifications.vendor_waiting"),
                detail: `${waitingVendors} vendor(s) are waiting for activation and review.`,
                priority: waitingVendors > 0 ? "high" : "medium",
            },
            {
                id: "admin-problem",
                title: t("notifications.raised_issues"),
                detail: `${raisedProblems} request(s) need intervention due to rejection or modification.`,
                priority: raisedProblems > 0 ? "high" : "medium",
            },
            {
                id: "admin-query",
                title: t("notifications.unresolved_queries"),
                detail: `${unresolvedQueries} query note(s) are open. ${escalationsToday} escalated today.`,
                priority: unresolvedQueries > 0 ? "medium" : "high",
            },
        ];
    }, [items, lowStockItems.length, requests, t, user?.role, vendors]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setIsLanguageOpen(false);
            }
        };

        if (isNotificationOpen || isLanguageOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isNotificationOpen, isLanguageOpen]);

    return (
        <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-6 bg-[var(--card)] border-b border-[var(--border)] transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg hover:bg-light-green/20 text-deep-green transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="text-lg font-semibold text-[var(--foreground)]">{t("dashboard.overview")}</div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full hover:bg-light-green/20 transition-colors text-[var(--foreground)]" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative" ref={languageRef}>
                    <button
                        className="p-2 rounded-full hover:bg-light-green/20 transition-colors text-[var(--foreground)]"
                        onClick={() => setIsLanguageOpen((prev) => !prev)}
                        aria-label="Change language"
                    >
                        <Globe className="w-5 h-5" />
                    </button>

                    {isLanguageOpen && (
                        <div className="absolute right-0 mt-3 w-48 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-[var(--border)]">
                                <p className="text-sm font-semibold text-[var(--foreground)]">{t("common.language")}</p>
                            </div>
                            <div className="py-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleChangeLanguage(lang.code)}
                                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                            locale === lang.code
                                                ? "bg-deep-green/20 text-deep-green font-semibold"
                                                : "text-[var(--foreground)] hover:bg-light-green/10"
                                        }`}
                                    >
                                        {lang.nativeLabel}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative" ref={notificationRef}>
                    <button
                        className="relative p-2 rounded-full hover:bg-light-green/20 transition-colors text-[var(--foreground)]"
                        onClick={() => setIsNotificationOpen((prev) => !prev)}
                        aria-label="Open important notifications"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 text-[10px] bg-amber-500 text-charcoal rounded-full border border-[var(--card)] flex items-center justify-center font-bold">
                            {notifications.length}
                        </span>
                    </button>

                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-[var(--border)]">
                                <p className="text-sm font-semibold text-[var(--foreground)]">{t("navbar.notifications")}</p>
                                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                                    {user?.role === "vendor" ? t("vendor_dashboard.title") : t("dashboard.title")}
                                </p>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="px-4 py-3 border-b border-[var(--border)]/60 last:border-b-0 hover:bg-light-green/10 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            {notification.priority === "high" ? (
                                                <TriangleAlert className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                                            ) : (
                                                <CircleDot className="w-4 h-4 mt-0.5 text-deep-green flex-shrink-0" />
                                            )}
                                            <div>
                                                <p className="text-sm font-semibold text-[var(--foreground)]">{notification.title}</p>
                                                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-5">{notification.detail}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-[var(--border)] mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-light-green/20 transition-colors">
                    <div className="w-8 h-8 bg-deep-green rounded-full flex items-center justify-center text-white font-bold uppercase text-sm">
                        {user ? user.name.charAt(0) : <User className="w-5 h-5" />}
                    </div>
                    <div className="text-sm font-medium text-[var(--foreground)] hidden md:block">
                        {user ? user.name : t("common.profile")}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
