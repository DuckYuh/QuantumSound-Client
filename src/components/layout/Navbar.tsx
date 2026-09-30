"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download } from "lucide-react";

import { Button, Logo } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { UserMenu } from "../bar/UserMenu";
import SearchBar from "@/components/search/SearchBar";

export default function Navbar() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [isTauri, setIsTauri] = useState(false);

    useEffect(() => {
        setIsTauri(
            typeof window !== "undefined" &&
            "__TAURI_INTERNALS__" in window
        );
    }, []);

    async function handleSignUpClick() {
        router.push("/register");
    }

    async function handleLoginClick() {
        router.push("/login");
    }

    return (
        <>
            <header className="fixed left-0 top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="flex h-[var(--spacing-navbar)] items-center gap-4 px-4 sm:px-6 lg:px-8">
                    <Logo />

                    <div className="flex min-w-0 flex-1 items-center gap-4 lg:pl-[var(--spacing-sidebar)] lg:pr-[var(--spacing-sidebar)]">
                        <div className="min-w-0 flex-1">
                            <SearchBar />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Web only */}
                        {!isTauri && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                    router.push("/download")
                                }
                            >
                                <Download className="mr-2 size-4" />
                                Download
                            </Button>
                        )}

                        {user ? (
                            <UserMenu
                                user={user}
                                logout={logout}
                            />
                        ) : (
                            <>
                                <Button
                                    variant="text"
                                    size="sm"
                                    onClick={handleSignUpClick}
                                >
                                    Sign up
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLoginClick}
                                >
                                    Log in
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}