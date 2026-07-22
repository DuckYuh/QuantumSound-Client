"use client";

import { useAuth } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const {user, loading} = useAuth();

    if(loading) return <p>Loading...</p>;

    if(!user)   redirect("/login");

    return children;
}