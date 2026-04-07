"use client";
import Link from "next/link";
import { Lock, Mail, User, Building2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function SignupPage() {
    const { signup } = useAuth();
    const t = useTranslations();
    const locale = useLocale();

    // Simple state just for demo
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        password: "",
        role: "admin" as 'admin' | 'vendor'
    });
    const [error, setError] = useState("");

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        const result = signup(formData.name, formData.email, formData.password, formData.role);
        if (!result.success) {
            setError(result.error ?? "Signup failed.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-green/20">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-charcoal">{t("auth.signup")}</h1>
                <p className="text-charcoal/60 mt-2">Join Vendor AI as an Admin or Company</p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">{t("forms.owner_name")}</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">{t("auth.email")}</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="email"
                            placeholder="admin@vendorai.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">{t("auth.role")}</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <select
                            value={formData.role}
                            onChange={(e) => {
                                setFormData({ ...formData, role: e.target.value as 'admin' | 'vendor' });
                                setError("");
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal"
                        >
                            <option value="admin">{t("auth.admin")}</option>
                            <option value="vendor">{t("auth.shopkeeper")}</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Organization</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Vendor AI Inc."
                            value={formData.organization}
                            onChange={(e) => {
                                setFormData({ ...formData, organization: e.target.value });
                                setError("");
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">{t("auth.password")}</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                setError("");
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                            required
                        />
                    </div>
                </div>

                {error ? (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
                ) : null}

                <button type="submit" className="w-full bg-deep-green hover:bg-deep-green/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-deep-green/10 mt-2">
                    {t("auth.signup")}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal/50">
                {t("auth.already_have_account")} <Link href={`/${locale}/login`} className="text-deep-green hover:text-deep-green/90 font-bold hover:underline">{t("auth.login")}</Link>
            </div>
        </div>
    );
}

