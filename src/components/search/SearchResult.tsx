"use client";

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import { Track } from "@/types/track";
import { Album } from "@/types/album";
import { User } from "@/types/user";
import SearchItem from "@/components/search/SearchItem";
import { useAudio } from "@/providers/AudioProvider";

interface Props {
    query: string;
}

export function SearchResults({query, }: Props) {
    const { playTrack } = useAudio();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["search", query],
        queryFn: () => searchService.search(query, 20),
        enabled: !!query,
    });

    if (!query) {
        return (
            <div>
                <h1>Search</h1>
                <p>
                    Search for tracks, albums, or users.
                </p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                <h1>
                    Search results for "{query}"
                </h1>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1>Something went wrong</h1>
            </div>
        );
    }

    const tracks = data?.data.tracks ?? [];
    const albums = data?.data.albums ?? [];
    const users = data?.data.users ?? [];

    const hasResults =
        tracks.length > 0 ||
        albums.length > 0 ||
        users.length > 0;

    return (
        <div className="space-y-8">
            {!hasResults && (
                <p className="text-muted-foreground">
                    No results found.
                </p>
            )}

            {tracks.length > 0 && (
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        Tracks
                    </h2>
                    {tracks.map((track: Track) => (
                        <SearchItem 
                            key={track.id} 
                            onClick={() => playTrack(track as Track)}
                            title={track.title}
                            image={track.album.coverImage ?? "/Logo512x512.png"}
                            subtitle={`${track.artist.displayName} • ${track.album.title}`}
                            className="cursor-pointer"
                        />
                    ))}
                </section>
            )}

            {albums.length > 0 && (
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        Albums
                    </h2>

                    {albums.map((album: Album) => (
                        <SearchItem 
                            key={album.id} 
                            href={`/album/${album.slug}`}
                            title={album.title}
                            image={album.coverImage ?? "/Logo512x512.png"}
                            subtitle={`${album.artist.displayName} • ${album.type}`}
                            className="cursor-pointer"
                        />
                    ))}
                </section>
            )}

            {users.length > 0 && (
                <section>
                    <h2 className="mb-4 text-xl font-semibold">
                        Users
                    </h2>

                    {users.map((user: User) => (
                        <SearchItem 
                            key={user.id} 
                            href={`/profile/${user.username}`}
                            title={user.displayName}
                            image={user.avatar ?? "/Logo512x512.png"}
                            subtitle={`@${user.username}`}
                            className="cursor-pointer"
                        />
                    ))}
                </section>
            )}
        </div>
    )
}