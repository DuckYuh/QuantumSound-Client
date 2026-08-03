'use client';

import { useState } from "react";
import SearchDropdown from "./SearchDropdown";
import { Input } from "@/components/ui";

export default function SearchBar() {
    const [query, setQuery] = useState("");

    return (
        <div className="search-bar relative ">
            <Input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {query && <SearchDropdown query={query} />}
        </div>
    );
}