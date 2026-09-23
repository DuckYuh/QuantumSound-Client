"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
    portal?: boolean;
};

export function Dropdown({
    trigger,
    items,
    className,
    placement = "bottom",
    portal = false,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });

    const ref = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            const target = e.target as Node;

            if (
                !ref.current?.contains(target) &&
                !menuRef.current?.contains(target)
            ) {
                setOpen(false);
            }
        }

        window.addEventListener("mousedown", handleClick);

        return () => {
            window.removeEventListener("mousedown", handleClick);
        };
    }, []);

    useEffect(() => {
        if (!open || !portal || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const menuWidth = 208;
        const gap = 8;

        let left = rect.right - menuWidth;

        // Không cho menu vượt khỏi viewport bên trái
        if (left < 8) {
            left = 8;
        }

        // Không cho menu vượt khỏi viewport bên phải
        if (left + menuWidth > window.innerWidth - 8) {
            left = window.innerWidth - menuWidth - 8;
        }

        const top =
            placement === "top"
                ? rect.top - gap
                : rect.bottom + gap;

        setPosition({
            top,
            left,
        });
    }, [open, portal, placement]);

    const menu = (
        <div
            ref={menuRef}
            className={
                portal
                    ? `fixed z-[9999] w-52 overflow-visible rounded-xl border border-border bg-card shadow-lg ${
                          placement === "top"
                              ? "-translate-y-full"
                              : ""
                      } ${className || ""}`
                    : `absolute right-0 w-52 overflow-visible rounded-xl border border-border bg-card shadow-lg ${
                          placement === "top"
                              ? "bottom-full mb-2"
                              : "top-full mt-2"
                      } ${className || ""}`
            }
            style={
                portal
                    ? {
                          top: position.top,
                          left: position.left,
                      }
                    : undefined
            }
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
                            ${item.disabled ? "opacity-50" : ""}
                            ${item.danger ? "text-red-500" : ""}
                        `}
                    >
                        <div className="flex items-center gap-2">
                            {item.icon}
                            <span>{item.label}</span>
                        </div>

                        {item.submenu && <span>▶</span>}
                    </button>

                    {item.submenu &&
                        hoveredItem === item.label && (
                            <div
                                className="
                                    absolute
                                    right-full
                                    top-0
                                    mr-0
                                    z-50
                                "
                                onMouseEnter={() =>
                                    setHoveredItem(item.label)
                                }
                                onMouseLeave={() =>
                                    setHoveredItem(null)
                                }
                            >
                                {item.submenu}
                            </div>
                        )}
                </div>
            ))}
        </div>
    );

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen((v) => !v)}
                className="inline-flex cursor-pointer"
            >
                {trigger}
            </div>

            {open &&
                (portal
                    ? createPortal(menu, document.body)
                    : menu)}
        </div>
    );
}