"use client";
import Link from "next/link";
import { Lock, Mail, User, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
    const router = useRouter();
    const { login } = useAuth();

    // Simple state just for demo
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: ""
    });

    const handleSignup = (e: FormEvent) => {
        e.preventDefault();
        // Simulate signup success
        console.log("Signing up...");
        login(formData.email, 'admin'); // Defaulting to admin role for signup demo
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-light-green/20">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-charcoal">Create Account</h1>
                <p className="text-charcoal/60 mt-2">Join Vendor AI as an Admin or Company</p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Full Name</label>
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
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Email Address</label>
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
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Organization</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="text"
                            placeholder="Vendor AI Inc."
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="w-full pl-10 pr-4 py-3 bg-light-green/5 border border-light-green/20 rounded-xl outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all text-charcoal placeholder:text-charcoal/30"
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-deep-green hover:bg-deep-green/90 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-deep-green/10 mt-2">
                    Create Account
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-charcoal/50">
                Already have an account? <Link href="/login" className="text-deep-green hover:text-deep-green/90 font-bold hover:underline">Sign in</Link>
            </div>
        </div>
    );
}

