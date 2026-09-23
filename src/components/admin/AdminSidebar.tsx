"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Music,
    Disc3,
    Tags,
    ListMusic,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: Users,
    },
    {
        label: "Tracks",
        href: "/admin/tracks",
        icon: Music,
    },
    {
        label: "Albums",
        href: "/admin/albums",
        icon: Disc3,
    },
    {
        label: "Genres",
        href: "/admin/genres",
        icon: ListMusic,
    },
    {
        label: "Tags",
        href: "/admin/tags",
        icon: Tags,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-background lg:flex lg:flex-col">
            <div className="flex h-16 items-center border-b border-border px-6">
                <Link
                    href="/admin"
                    className="text-lg font-semibold tracking-tight"
                >
                    QuantumSound
                </Link>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                active
                                    ? "bg-surface text-foreground"
                                    : "text-muted-foreground hover:bg-surface/70 hover:text-foreground"
                            )}
                        >
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}