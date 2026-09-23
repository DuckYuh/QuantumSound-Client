"use client";

import SearchItem from "./SearchItem";
import { Card } from "@/components/ui";
import { useDeferredValue, useState } from "react";
import { searchService } from "@/services/search.service";
import { SearchResult } from "@/types/search";
import { useAudio } from "@/providers/AudioProvider";
import { Track } from "@/types/track";
import { useAuth } from "@/providers/AuthProvider";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type SearchDropdownProps = {
    query: string;
    onQueryChangeAction?: (newQuery: string) => void;
};

export default function SearchDropdown({ query, onQueryChangeAction }: SearchDropdownProps) {
    const SEARCH_LIMIT = 3;
    const { playTrack } = useAudio();
    const [showAuthRequired, setShowAuthRequired] = useState(false);
    const { user, loading } = useAuth();
    const deferredQuery = useDeferredValue(query.trim());
    const { data: results } = useQuery<SearchResult>({
        queryKey: queryKeys.search(deferredQuery, SEARCH_LIMIT),
        queryFn: async () =>
            (await searchService.search(deferredQuery, SEARCH_LIMIT)).data,
        enabled: Boolean(deferredQuery),
    });

    function requireAuth(action: () => void) {
        if (loading) return;

        if (!user) {
            setShowAuthRequired(true);
            return;
        }

        action();
    }

    async function handleItemClick(itemType: "track" | "album" | "artist", itemId: string) {
        if (itemType === "track") {
            const track = results?.tracks.find((t) => t.id === itemId);
            if (track) {
                requireAuth(() => playTrack(track as Track));
                onQueryChangeAction?.("");
            }
        } else if (itemType === "album") {
            requireAuth(() => {
                if (user) {
                    window.location.href = `/album/${itemId}`;
                    onQueryChangeAction?.("");
                }
            });
        } else if (itemType === "artist") {
            requireAuth(() => {
                if (user) {
                    window.location.href = `/profile/${itemId}`;
                    onQueryChangeAction?.("");
                }
            });
        }
    }

    const tracks = (results?.tracks ?? []).slice(0, SEARCH_LIMIT);
    const albums = (results?.albums ?? []).slice(0, SEARCH_LIMIT);
    const artists = (results?.users ?? []).slice(0, SEARCH_LIMIT);

    const hasResults = tracks.length > 0 || albums.length > 0 || artists.length > 0;

    return (
        <>
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
                                        onClick={() => handleItemClick("track", track.id)}
                                        title={track.title}
                                        image={track.album.coverImage ?? "/Logo512x512.png"}
                                        subtitle={`${track.artist.displayName} • ${track.album.title}`}
                                        className="cursor-pointer"
                                    />
                                ))}
                            </div>
                        )}

                        {albums.length > 0 && (
                            <div>
                                {albums.map((album) => (
                                    <SearchItem
                                        key={album.id}
                                        href={user ? `/album/${album.slug}` : undefined}
                                        onClick={() => handleItemClick("album", album.id)}
                                        title={album.title}
                                        image={album.coverImage ?? "/Logo512x512.png"}
                                        subtitle={`${album.artist.displayName} • ${album.type}`}
                                        className="cursor-pointer"
                                    />
                                ))}
                            </div>
                        )}

                        {artists.length > 0 && (
                            <div>
                                {artists.map((artist) => (
                                    <SearchItem
                                        key={artist.id}
                                        href={user ? `/profile/${artist.username}` : undefined}
                                        onClick={() => handleItemClick("artist", artist.id)}
                                        title={artist.displayName}
                                        image={artist.avatar ?? "/Logo512x512.png"}
                                        subtitle={`@${artist.username}`}
                                        className="cursor-pointer"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Card>
            <AuthRequiredModal
                open={showAuthRequired}
                onCloseAction={() => setShowAuthRequired(false)}
                title="Login to open search results"
                description="You can browse search results, but you need to log in to play tracks or open details."
            />
        </>
    );
}
