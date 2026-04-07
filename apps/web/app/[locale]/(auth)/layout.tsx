export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[color-mix(in_srgb,var(--background)_92%,var(--primary)_8%)] text-[var(--foreground)] transition-colors duration-300">
            <div className="w-full max-w-md">
                {children}
            </div>
        </div>
    );
}
