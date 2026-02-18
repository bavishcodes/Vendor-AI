"use client";
import { Bell, User, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";

const Navbar = () => {
    const { user } = useAuth();
    const { toggleSidebar } = useSidebar();

    return (
        <header className="h-16 glass sticky top-0 z-40 flex items-center justify-between px-6 bg-white border-b border-light-green/30">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="p-2 -ml-2 rounded-lg hover:bg-light-green/20 text-deep-green transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="text-lg font-semibold text-charcoal">Overview</div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative p-2 rounded-full hover:bg-light-green/20 transition-colors text-charcoal">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-light-green/30 mx-2"></div>

                <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-full hover:bg-light-green/20 transition-colors">
                    <div className="w-8 h-8 bg-deep-green rounded-full flex items-center justify-center text-white font-bold uppercase text-sm">
                        {user ? user.name.charAt(0) : <User className="w-5 h-5" />}
                    </div>
                    <div className="text-sm font-medium text-charcoal hidden md:block">
                        {user ? user.name : "Guest User"}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
