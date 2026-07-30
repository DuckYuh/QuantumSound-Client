"use client";

import { useAuth } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const {user, loading} = useAuth();

    if(loading) return <p>Loading...</p>;

    if(!user)   redirect("/login");

    return <AppLayout>{children}</AppLayout>;
}