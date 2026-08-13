"use client";

import { LogIn, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type AuthRequiredModalProps = {
    open: boolean;
    onCloseAction: () => void;
    title?: string;
    description?: string;
};

export default function AuthRequiredModal({
    open,
    onCloseAction,
    title = "Login to continue",
    description = "You need to log in or create an account to continue.",
}: AuthRequiredModalProps) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    const handleLogin = () => {
        onCloseAction();
        router.push("/login");
    };

    const handleRegister = () => {
        onCloseAction();
        router.push("/register");
    };

    return createPortal((
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={onCloseAction}
        >
            <div
                className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onCloseAction}
                    className="absolute right-3 top-3"
                    aria-label="Close"
                >
                    <X className="size-4" />
                </Button>

                {/* Icon */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <LogIn className="size-5" />
                </div>

                {/* Content */}
                <div>
                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-2">
                    <Button
                        type="button"
                        onClick={handleLogin}
                        className="w-full"
                        leftIcon={<LogIn className="size-4" />}
                    >
                        Log in
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleRegister}
                        className="w-full"
                        leftIcon={<UserPlus className="size-4" />}
                    >
                        Sign up
                    </Button>
                </div>
            </div>
        </div>
    ), document.body);
}