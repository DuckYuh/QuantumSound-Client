'use client';

import { playlistService } from "@/services/playlist.service";
import { Playlist } from "@/types/playlist";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";

type Props = {
    trackId: string;
};

export function PlaylistSubmenu({ trackId }: Props) {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [addingPlaylistId, setAddingPlaylistId] = useState<string | null>(null);
    const [showAuthRequired, setShowAuthRequired] = useState(false);
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            setPlaylists([]);
            return;
        }

        const fetchPlaylists = async () => {
            try {
                const response = await playlistService.getUserPlaylists(user.username);
                setPlaylists(response.data);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            }
        };

        fetchPlaylists();
    }, [loading, user]);

    async function handleAddTrack(playlistId: string) {
        if (!user) {
            setShowAuthRequired(true);
            return;
        }

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
        <>
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
            <AuthRequiredModal
                open={showAuthRequired}
                onCloseAction={() => setShowAuthRequired(false)}
                title="Login to manage playlists"
                description="Please log in or create an account to add tracks to playlists."
            />
        </>
    );
}