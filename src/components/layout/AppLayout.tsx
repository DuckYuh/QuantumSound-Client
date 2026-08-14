import AppShell from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
            <div className="pointer-events-none absolute inset-0 ..." />

            <main className="relative min-h-screen pt-16 pb-32 lg:pt-20 lg:pb-28 lg:pl-sidebar lg:pr-sidebar">
                <div className="mx-auto w-full max-w-[var(--container-content)] px-4 pb-8 sm:px-6 lg:px-8">
                    <AppShell>
                        {children}
                    </AppShell>
                </div>
            </main>
        </div>
    );
}