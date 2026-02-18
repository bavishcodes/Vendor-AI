"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'admin' | 'vendor'>('admin');
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, role);
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-light-green/30">
            <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-light-green/20 mb-4">
                    <div className="w-8 h-8 bg-deep-green rounded-lg flex items-center justify-center text-white font-bold">V</div>
                </div>
                <h2 className="text-2xl font-bold text-charcoal">Welcome Back</h2>
                <p className="text-charcoal/60 text-sm mt-2">Sign in to manage your {role === 'admin' ? 'organization' : 'shop'}.</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-light-green/10 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white text-deep-green shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                    Company Login
                </button>
                <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'vendor' ? 'bg-white text-deep-green shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                    Shop Login
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-light-green/50 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                        placeholder="name@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-light-green/50 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-charcoal cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-deep-green focus:ring-deep-green border-light-green mr-2" />
                        Remember me
                    </label>
                    <a href="#" className="text-deep-green hover:text-deep-green/80 font-medium">Forgot password?</a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-deep-green hover:bg-deep-green/90 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-deep-green/20"
                >
                    Sign In as {role === 'admin' ? 'Admin' : 'Shop Keeper'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal/60">
                Don't have an account? <Link href="/signup" className="text-deep-green font-bold hover:underline">Create one</Link>
            </div>
        </div>
    );
}
