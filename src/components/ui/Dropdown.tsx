"use client";

import { useEffect, useRef, useState } from "react";

export type DropdownItem = {
    label: string;
    icon?: React.ReactNode;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    submenu?: React.ReactNode;
};

type DropdownProps = {
    trigger: React.ReactNode;
    items: DropdownItem[];
    className?: string;
    placement?: "bottom" | "top";
};

export function Dropdown({ 
    trigger, 
    items, 
    className,
    placement = "bottom",
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
            <div
                onClick={() => setOpen((v) => !v)}
                className="inline-flex cursor-pointer"
            >
                {trigger}
            </div>

            {open && (
                <div
                    className={`absolute right-0 w-52 overflow-visible rounded-xl border border-border bg-card shadow-lg ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"} ${className || ""}`}
                >
                    {items.map((item) => (
                        <div
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <button
                                onClick={() => {
                                    if (!item.submenu) {
                                        item.onClick?.();
                                        setOpen(false);
                                    }
                                }}
                                disabled={item.disabled}
                                className={`
                                    flex w-full items-center justify-between
                                    px-4 py-3 text-left transition
                                    hover:bg-muted
                                    hover:rounded-full
                                    ${item.disabled && "opacity-50"}
                                    ${item.danger && "text-red-500"}
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {item.submenu && (
                                    <span>▶</span>
                                )}
                            </button>

                            {item.submenu && hoveredItem === item.label && (
                                <div
                                    className="
                                        absolute
                                        right-full
                                        top-0
                                        mr-0
                                        z-50
                                    "
                                    onMouseEnter={() => setHoveredItem(item.label)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >
                                    {item.submenu}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}