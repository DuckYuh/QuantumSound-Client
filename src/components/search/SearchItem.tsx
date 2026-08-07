'use client';

import Link from "next/link";

interface SearchItemProps {
    href: string;
    title: string;
    image?: string;
    subtitle?: string;
}

export default function SearchItem({ href, title, image, subtitle }: SearchItemProps) {
    return (
        <Link
            href={href}
            className="search-dropdown-item flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-primary-hover"
        >
            {image && (
                <img
                    src={image}
                    alt={title}
                    className="h-10 w-10 rounded-md object-cover"
                />
            )}
            <div className="min-w-0">
                <div className="truncate font-medium">{title}</div>
                {subtitle && (
                    <div className="truncate text-xs text-muted-foreground">
                        {subtitle}
                    </div>
                )}
            </div>
        </Link>
    );
}