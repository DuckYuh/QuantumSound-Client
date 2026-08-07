'use client';

import { playlistService } from "@/services/playlist.service";
import { Playlist } from "@/types/playlist";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
    trackId: string;
};

export function PlaylistSubmenu({ trackId }: Props) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await playlistService.getAllPlaylists();
                setPlaylists(response.data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, []);

    async function handleAddTrack(playlistId: string) {
        try {
            setAddingPlaylistId(playlistId);
            await playlistService.addTrack({
                playlistId,
                trackId,
            });

            toast.success("Added to playlist.");
        } catch (error) {
            console.error("Error adding track to playlist:", error);
            toast.error("Failed to add track to playlist.");
        } finally {
            setAddingPlaylistId(null);
        }
    }

    return (
        <div className="w-72 rounded-xl border border-border bg-card shadow-lg bg-surface">
            <div className="max-h-80 overflow-y-auto">
                {playlists.map((playlist) => (
                    <button
                        key={playlist.id}
                        className="w-full px-4 py-3 text-left transition hover:bg-muted disabled:opacity-50 hover:rounded-full"
                        onClick={() => handleAddTrack(playlist.id)}
                        disabled={addingPlaylistId === playlist.id}
                    >
                        {playlist.title}
                    </button>
                ))}
            </div>
        </div>
    );
}