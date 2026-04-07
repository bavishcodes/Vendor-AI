"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<'admin' | 'vendor'>('admin');
    const [error, setError] = useState("");
    const { login } = useAuth();
    const t = useTranslations();
    const locale = useLocale();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const result = login(email, password, role);
        if (!result.success) {
            setError(result.error ?? "Login failed.");
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-light-green/30">
            <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-light-green/20 mb-4">
                    <div className="w-8 h-8 bg-deep-green rounded-lg flex items-center justify-center text-white font-bold">V</div>
                </div>
                <h2 className="text-2xl font-bold text-charcoal">{t("dashboard.welcome")}</h2>
                <p className="text-charcoal/60 text-sm mt-2">Sign in to manage your {role === 'admin' ? 'organization' : 'shop'}.</p>
            </div>

            {/* Role Toggle */}
            <div className="flex bg-light-green/10 p-1 rounded-xl mb-6">
                <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'admin' ? 'bg-white text-deep-green shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                    {t("auth.admin")}
                </button>
                <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${role === 'vendor' ? 'bg-white text-deep-green shadow-sm' : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                    {t("auth.shopkeeper")}
                </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{t("auth.email")}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className="w-full px-4 py-2 bg-white border border-light-green/50 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                        placeholder="name@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">{t("auth.password")}</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        className="w-full px-4 py-2 bg-white border border-light-green/50 rounded-lg focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green outline-none transition-all text-charcoal placeholder:text-charcoal/30"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {error ? (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                ) : null}

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-charcoal cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded text-deep-green focus:ring-deep-green border-light-green mr-2" />
                        {t("auth.remember_me")}
                    </label>
                    <a href="#" className="text-deep-green hover:text-deep-green/80 font-medium">{t("auth.forgot_password")}</a>
                </div>

                <button
                    type="submit"
                    className="w-full bg-deep-green hover:bg-deep-green/90 text-white font-bold py-2.5 rounded-lg transition-colors shadow-lg shadow-deep-green/20"
                >
                    {t("auth.login")} {role === 'admin' ? t("auth.admin") : t("auth.shopkeeper")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal/60">
                {t("auth.dont_have_account")} <Link href={`/${locale}/signup`} className="text-deep-green font-bold hover:underline">{t("auth.signup")}</Link>
            </div>
        </div>
    );
}
