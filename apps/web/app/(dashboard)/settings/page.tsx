"use client";
import { User, Bell, Shield, Database, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { user, updateProfile, isLoading } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: ""
    });

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        if (user) {
            setFormData({
                fullName: user.name,
                email: user.email
            });
        }
    }, [user, isLoading, router]);

    const handleSave = () => {
        if (!user) return;
        updateProfile({
            ...user,
            name: formData.fullName,
            email: formData.email
        });
        alert("Profile updated successfully!");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-deep-green"></div>
                <span className="ml-3 text-charcoal/40 font-medium">Loading settings...</span>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-charcoal">Settings</h1>
                <p className="text-charcoal/60 text-sm mt-1">Manage your account preferences and system configurations.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-light-green/30 divide-y divide-light-green/20">
                {/* Profile Section */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-deep-green" />
                        Profile Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-2 bg-light-green/5 border border-light-green/20 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-charcoal/70 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 bg-light-green/5 border border-light-green/20 rounded-lg outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green text-charcoal"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                        <Bell className="w-5 h-5 text-deep-green" />
                        Notifications
                    </h2>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-light-green/5 rounded-lg border border-light-green/20 cursor-pointer hover:bg-light-green/10 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-charcoal">Critical Alerts</p>
                                <p className="text-xs text-charcoal/50">Stock outs and spoilage risks</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-deep-green rounded focus:ring-deep-green/20" />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-light-green/5 rounded-lg border border-light-green/20 cursor-pointer hover:bg-light-green/10 transition-colors">
                            <div>
                                <p className="text-sm font-bold text-charcoal">Weekly Reports</p>
                                <p className="text-xs text-charcoal/50">Summary of sales and performance</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-deep-green rounded focus:ring-deep-green/20" />
                        </label>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="p-6">
                    <h2 className="text-lg font-bold text-charcoal flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-deep-green" />
                        Security
                    </h2>
                    <button className="text-sm text-deep-green font-bold hover:text-deep-green/80 hover:underline">Change Password</button>
                </div>

                <div className="p-6 bg-light-green/5 flex justify-end rounded-b-xl border-t border-light-green/20">
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white font-bold rounded-lg hover:bg-charcoal/90 transition-colors shadow-lg shadow-charcoal/10">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
