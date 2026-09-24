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
    openOnContextMenu?: boolean;
    triggerClassName?: string;
};

type MenuSide = "left" | "right";

const dropdownOpenEvent = "quantum-sound:dropdown-open";

export function Dropdown({
    trigger,
    items,
    className,
    placement = "bottom",
    portal = false,
    openOnContextMenu = false,
    triggerClassName,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
    });
    const [menuDirection, setMenuDirection] = useState<"top" | "bottom">("bottom");
    const [submenuSide, setSubmenuSide] = useState<MenuSide>("left");

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
        function closeOtherDropdowns(event: Event) {
            const source = (event as CustomEvent<HTMLDivElement>).detail;

            if (source !== ref.current) {
                setOpen(false);
            }
        }

        window.addEventListener(dropdownOpenEvent, closeOtherDropdowns);

        return () => {
            window.removeEventListener(dropdownOpenEvent, closeOtherDropdowns);
        };
    }, []);

    useEffect(() => {
        if (!open || !portal || openOnContextMenu || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const menuWidth = 208;
        const menuHeight = Math.min(items.length * 48 + 2, window.innerHeight - 16);
        const gap = 8;
        const canOpenAbove = rect.top - gap - menuHeight >= 8;
        const canOpenBelow = rect.bottom + gap + menuHeight <= window.innerHeight - 8;
        const direction =
            placement === "top"
                ? canOpenAbove || !canOpenBelow
                    ? "top"
                    : "bottom"
                : canOpenBelow || !canOpenAbove
                    ? "bottom"
                    : "top";

        let left = rect.right - menuWidth;

        // Không cho menu vượt khỏi viewport bên trái
        if (left < 8) {
            left = 8;
        }

        // Không cho menu vượt khỏi viewport bên phải
        if (left + menuWidth > window.innerWidth - 8) {
            left = window.innerWidth - menuWidth - 8;
        }

        const top = direction === "top" ? rect.top - gap : rect.bottom + gap;

        setMenuDirection(direction);
        setPosition({
            top,
            left,
        });
    }, [items.length, open, openOnContextMenu, placement, portal]);

    const menuTransform = openOnContextMenu
        ? menuDirection === "top"
            ? "-translate-y-full"
            : ""
        : menuDirection === "top"
            ? "-translate-y-full"
            : "";

    const menu = (
        <div
            ref={menuRef}
            className={
                portal
                    ? `fixed z-[9999] w-52 overflow-visible rounded-xl border border-border bg-card shadow-lg ${
                          menuTransform
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
                    onMouseEnter={() => {
                        if (menuRef.current) {
                            const menuRect = menuRef.current.getBoundingClientRect();
                            setSubmenuSide(
                                window.innerWidth - menuRect.right >= 216
                                    ? "right"
                                    : "left",
                            );
                        }
                        setHoveredItem(item.label);
                    }}
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
                                className={`absolute top-0 z-50 ${
                                    submenuSide === "right"
                                        ? "left-full ml-1"
                                        : "right-full mr-1"
                                }`}
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
                onClick={() => {
                    if (!openOnContextMenu) {
                        if (open) {
                            setOpen(false);
                        } else {
                            window.dispatchEvent(
                                new CustomEvent(dropdownOpenEvent, { detail: ref.current }),
                            );
                            setOpen(true);
                        }
                    }
                }}
                onContextMenu={(event) => {
                    if (!openOnContextMenu) return;

                    event.preventDefault();
                    const menuWidth = 208;
                    const menuHeight = Math.min(items.length * 48 + 2, window.innerHeight - 16);
                    const gap = 8;
                    const showAbove = event.clientY + menuHeight + gap > window.innerHeight;
                    const showLeft = event.clientX + menuWidth + gap > window.innerWidth;

                    setMenuDirection(showAbove ? "top" : "bottom");
                    setPosition({
                        top: showAbove ? event.clientY - gap : event.clientY + gap,
                        left: showLeft
                            ? Math.max(gap, event.clientX - menuWidth - gap)
                            : Math.min(event.clientX + gap, window.innerWidth - menuWidth - gap),
                    });
                    window.dispatchEvent(
                        new CustomEvent(dropdownOpenEvent, { detail: ref.current }),
                    );
                    setOpen(true);
                }}
                className={triggerClassName ?? "inline-flex cursor-pointer"}
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