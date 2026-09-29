"use client";

import { useEffect, useState } from "react";
import { SearchResults } from "@/components/search/SearchResult";
import SearchBar from "@/components/search/SearchBar";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    useEffect(() => {
        setQuery(new URLSearchParams(window.location.search).get("query")?.trim() ?? "");
    }, []);

    if (query === "") {
        return (
            <div className="space-y-8">
                <div className="lg:hidden">
                    <SearchBar />
                </div>
            
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-2xl font-bold">Searching Page</h1>
                    <p className="text-muted-foreground">
                        Please provide a search query to see results.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="lg:hidden">
                <SearchBar />
            </div>

            <h1 className="text-2xl font-bold">
                Search results for "{query}"
            </h1>

            <SearchResults query={query} />
        </div>
    );
}