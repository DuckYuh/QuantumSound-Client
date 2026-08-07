'use client';

import { useState } from "react";
import { Playlist } from "@/types/playlist";
import { playlistService } from "@/services/playlist.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";

interface PlaylistSideListProps {
  targetUser: {
    username: string;
  };
}

export default function PlaylistSideList({ targetUser }: PlaylistSideListProps) {
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();

    const {data: playlists = [], isLoading, error, } = useQuery<Playlist[]>({
        queryKey: ["user-playlists", targetUser.username],
        queryFn: async () => {
            const res = await playlistService.getUserPlaylists(targetUser.username);
            return res.data;
        },
    });

    const displayedPlaylists = showAll ? playlists : playlists.slice(0, 3);

    async function onPlaylistClick(id: string) {
        router.push(`/playlist/${id}`);
    }

    if (isLoading) {
        return <div>Loading playlists...</div>;
    }

    if (error) {
        return <div>Failed to load playlists.</div>;
    }

    if (playlists.length === 0) {
        return null;
    }
    
    return (
        <div className="mt-6 rounded-xl border border-border bg-surface-active/80 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Playlists</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
                {displayedPlaylists.map((playlist) => (
                    <div key={playlist.id} className="cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => onPlaylistClick(playlist.id)}>
                        <img
                            src={playlist.coverImage ?? "/Logo512x512.png"}
                            alt={playlist.title}
                            className="h-8 w-8 object-cover inline-block mr-2"
                        />
                        {playlist.title}
                    </div>
                ))}
            </div>
            {playlists.length > 3 && (
                <Button
                    onClick={() => setShowAll(!showAll)}
                    variant="text"
                >
                    {showAll ? "Show Less" : `More (+${playlists.length - 3})`}
                </Button>
            )}
        </div>
    );
}