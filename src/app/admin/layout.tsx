 "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        } else if (!loading && user?.role !== "ADMIN") {
            router.replace("/");
        }
    }, [loading, user, router]);

    if (loading || !user || user.role !== "ADMIN") {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AdminSidebar />

            <div className="lg:pl-64">
                <AdminHeader />

                <main className="min-h-[calc(100vh-4rem)]">
                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}