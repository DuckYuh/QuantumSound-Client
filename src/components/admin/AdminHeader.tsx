"use client";

import { Shield, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui";

export default function AdminHeader() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface">
                    <Shield className="size-4" />
                </div>

                <div className="hidden sm:block">
                    <p className="text-sm font-semibold">
                        Admin Panel
                    </p>
                    <p className="text-xs text-muted-foreground">
                        QuantumSound Management
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium">
                        {user?.displayName || user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Administrator
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    aria-label="Logout"
                >
                    <LogOut className="size-4" />
                </Button>
            </div>
        </header>
    );
}