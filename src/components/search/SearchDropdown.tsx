'use client';

import SearchItem from "./SearchItem";
import { Card } from "@/components/ui";
import { useState, useEffect } from "react";
import { searchService } from "@/services/search.service";
import { SearchResult } from "@/types/search";

export default function SearchDropdown({ query }: { query: string }) {
    const [results, setResults] = useState<SearchResult | null>(null);

    useEffect(() => {
        let isActive = true;

        async function fetchResults() {
            try {
                const res = await searchService.search(query);
                if (isActive) {
                    setResults(res.data);
                }
            }
            catch (error) {
                console.error("Error fetching search results:", error);
            }
        }

        const timer = setTimeout(() => {
            if (!query.trim()) return;

            fetchResults();
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(timer);
        };
    }, [query]);

    const tracks = results?.tracks ?? [];
    const albums = results?.albums ?? [];
    const artists = results?.users ?? [];

    const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;

    return (
        <Card className="search-dropdown bg-surface absolute left-0 top-full z-50 mt-2 w-full">
            {!hasResults ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                    No results found
                </div>
            ) : (
                <div className="py-2">
                    {tracks.length > 0 && (
                        <div>
                            {tracks.map((track) => (
                                <SearchItem
                                    key={track.id}
                                    href={`/album/${track.album.slug}`}
                                    title={track.title}
                                    image={track.album.coverImage ?? "/Logo512x512.png"}
                                    subtitle={`${track.artist.displayName} • ${track.album.title}`}
                                />
                            ))}
                        </div>
                    )}

                    {albums.length > 0 && (
                        <div>
                            {albums.map((album) => (
                                <SearchItem
                                    key={album.id}
                                    href={`/album/${album.slug}`}
                                    title={album.title}
                                    image={album.coverImage ?? "/Logo512x512.png"}
                                    subtitle={album.artist.displayName}
                                />
                            ))}
                        </div>
                    )}

                    {artists.length > 0 && (
                        <div>
                            {artists.map((artist) => (
                                <SearchItem
                                    key={artist.id}
                                    href={`/profile/${artist.username}`}
                                    title={artist.displayName}
                                    image={artist.avatar ?? "/Logo512x512.png"}
                                    subtitle={`@${artist.username}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}