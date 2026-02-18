"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    role: 'admin' | 'vendor';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: 'admin' | 'vendor') => void;
    updateProfile: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem("vendor_ai_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: 'admin' | 'vendor' = 'admin') => {
        // Derive name from email (part before @, capitalized)
        const emailPrefix = email.split('@')[0];
        const derivedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

        // Mock user data
        const newUser: User = {
            name: derivedName || (role === 'admin' ? "Admin" : "Shop Keeper"),
            email: email,
            role: role
        };
        setUser(newUser);
        localStorage.setItem("vendor_ai_user", JSON.stringify(newUser));

        // Redirect based on role
        if (role === 'admin') {
            router.push("/");
        } else {
            router.push("/vendor");
        }
    };

    const updateProfile = (userData: User) => {
        setUser(userData);
        localStorage.setItem("vendor_ai_user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("vendor_ai_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, updateProfile, logout, isLoading }}>
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
