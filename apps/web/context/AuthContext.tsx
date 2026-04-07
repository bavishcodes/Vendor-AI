"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    role: 'admin' | 'vendor';
}

interface StoredAccount {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'vendor';
}

interface AuthResult {
    success: boolean;
    error?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string, role: 'admin' | 'vendor') => AuthResult;
    signup: (name: string, email: string, password: string, role: 'admin' | 'vendor') => AuthResult;
    updateProfile: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const getLocalePrefix = () => {
        const segments = pathname.split("/").filter(Boolean);
        const candidate = segments[0];
        const supported = ["en", "hi", "ta", "te", "kn"];
        return candidate && supported.includes(candidate) ? `/${candidate}` : "/en";
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("vendor_ai_user");
        if (storedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const getStoredAccounts = (): StoredAccount[] => {
        const rawAccounts = localStorage.getItem("vendor_ai_accounts");
        if (!rawAccounts) {
            return [];
        }

        try {
            return JSON.parse(rawAccounts) as StoredAccount[];
        } catch {
            return [];
        }
    };

    const saveStoredAccounts = (accounts: StoredAccount[]) => {
        localStorage.setItem("vendor_ai_accounts", JSON.stringify(accounts));
    };

    const login = (email: string, password: string, role: 'admin' | 'vendor' = 'admin'): AuthResult => {
        const normalizedEmail = email.trim().toLowerCase();
        const accounts = getStoredAccounts();
        const account = accounts.find(
            (item) => item.email.toLowerCase() === normalizedEmail && item.role === role
        );

        if (!account) {
            return {
                success: false,
                error: `No ${role === 'admin' ? 'admin' : 'shopkeeper'} account found for this Gmail. Please sign up first.`
            };
        }

        if (account.password !== password) {
            return {
                success: false,
                error: "Incorrect password. Please use your original password."
            };
        }

        const newUser: User = {
            name: account.name,
            email: account.email,
            role: account.role
        };
        setUser(newUser);
        localStorage.setItem("vendor_ai_user", JSON.stringify(newUser));

        // Redirect based on role
        const localePrefix = getLocalePrefix();
        if (role === 'admin') {
            router.push(`${localePrefix}`);
        } else {
            router.push(`${localePrefix}/vendor`);
        }

        return { success: true };
    };

    const signup = (
        name: string,
        email: string,
        password: string,
        role: 'admin' | 'vendor'
    ): AuthResult => {
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!normalizedEmail || !trimmedPassword) {
            return {
                success: false,
                error: "Gmail and password are required."
            };
        }

        const accounts = getStoredAccounts();
        const existing = accounts.find(
            (item) => item.email.toLowerCase() === normalizedEmail && item.role === role
        );

        if (existing) {
            return {
                success: false,
                error: "This account already exists. Please log in with your original Gmail and password."
            };
        }

        const derivedName = normalizedEmail.split('@')[0];
        const displayName =
            name.trim() ||
            (derivedName ? derivedName.charAt(0).toUpperCase() + derivedName.slice(1) : role === 'admin' ? "Admin" : "Shop Keeper");

        const newAccount: StoredAccount = {
            name: displayName,
            email: normalizedEmail,
            password: trimmedPassword,
            role
        };

        saveStoredAccounts([...accounts, newAccount]);
        return login(normalizedEmail, trimmedPassword, role);
    };

    const updateProfile = (userData: User) => {
        setUser(userData);
        localStorage.setItem("vendor_ai_user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("vendor_ai_user");
        router.push(`${getLocalePrefix()}/login`);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, updateProfile, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
