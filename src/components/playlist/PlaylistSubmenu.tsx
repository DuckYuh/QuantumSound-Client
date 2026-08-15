'use client';

import { playlistService } from "@/services/playlist.service";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Playlist } from "@/types/playlist";

type Props = {
    trackId: string;
};

export function PlaylistSubmenu({ trackId }: Props) {
    const [showAuthRequired, setShowAuthRequired] = useState(false);
    const { user, loading } = useAuth();
    const queryClient = useQueryClient();
    const { data: playlists = [] } = useQuery<Playlist[]>({
        queryKey: queryKeys.myPlaylists(),
        queryFn: async () => (await playlistService.getMyPlaylists()).data,
        enabled: Boolean(user) && !loading,
    });
    const addTrack = useMutation({
        mutationFn: (playlistId: string) => playlistService.addTrack({ playlistId, trackId }),
        onSuccess: (_, playlistId) => queryClient.invalidateQueries({ queryKey: queryKeys.playlistTracks(playlistId) }),
    });

    async function handleAddTrack(playlistId: string) {
        if (!user) {
            setShowAuthRequired(true);
            return;
        }

        try {
            await addTrack.mutateAsync(playlistId);

            toast.success("Added to playlist.");
        } catch (error) {
            console.error("Error adding track to playlist:", error);
            toast.error("Failed to add track to playlist.");
        } finally { /* mutation state drives the pending UI */ }
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
                            disabled={addTrack.isPending && addTrack.variables === playlist.id}
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
