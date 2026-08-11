'use client';

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import SearchDropdown from "./SearchDropdown";
import { Input } from "@/components/ui";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (!trimmedQuery) {
            return;
        }

        router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <form className="search-bar relative" onSubmit={handleSubmit}>
            <Input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && <SearchDropdown query={query} />}
        </form>
    );
}