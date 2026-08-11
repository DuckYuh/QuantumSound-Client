'use client';

import Link from "next/link";

interface SearchItemProps {
    href?: string;
    title: string;
    image?: string;
    subtitle?: string;
    className?: string;

    onClick?: () => void;
}

export default function SearchItem({ href, title, image, subtitle, onClick, className }: SearchItemProps) {
    const content = (
        <>
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="h-10 w-10 rounded-md object-cover"
                />
            )}
            <div className="min-w-0">
                <div className="truncate font-medium">{title}</div>
                {subtitle && <div className="truncate text-xs opacity-70">{subtitle}</div>}
            </div>
        </>
    );

    const combinedClassName = `${className || "search-dropdown-item"} flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary-hover`;

    if (!href) {
        return (
            <div className={combinedClassName} onClick={onClick}>
                {content}
            </div>
        );
    }

    return (
        <Link href={href} className={combinedClassName}>
            {content}
        </Link>
    );
}