"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Search",
        href: "/search",
        icon: Search,
    },
    {
        label: "Library",
        href: "/library",
        icon: Library,
    },
];

export default function BottomNavigation() {
    const pathname = usePathname();
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden" >
            <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
                {navItems.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex h-full min-w-16 flex-col items-center justify-center gap-1",
                                "text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-5",
                                    isActive && "stroke-[2.5]"
                                )}
                            />

                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}