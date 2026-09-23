import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children, }: { children: React.ReactNode; }) {
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