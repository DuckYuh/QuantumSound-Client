"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownItem = {
    label: string;
    onClick?: () => void;
    danger?: boolean;
};

type DropdownProps = {
    trigger: React.ReactNode;
    items: DropdownItem[];
    className?: string;
};

export function Dropdown({ 
    trigger, 
    items, 
    className 
}: DropdownProps) {
    const [open, setOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!ref.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        window.addEventListener("mousedown", handleClick);

        return () => {
            window.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <div
            ref={ref}
            className="relative"
        >
            <button
                onClick={() => setOpen((v) => !v)}
            >
                {trigger}
            </button>

            {open && (
                <div className={`absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg ${className || ""}`}>
                    {items.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                item.onClick?.();
                                setOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left transition hover:bg-muted ${
                                item.danger
                                    ? "text-red-500"
                                    : ""
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}