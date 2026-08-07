'use client';

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { playlistService } from "@/services/playlist.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";

type PlaylistVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

interface PlaylistPopupProps {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function PlaylistPopup({ open, onClose, onCreated }: PlaylistPopupProps) {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [visibility, setVisibility] = useState<PlaylistVisibility>("PUBLIC");
    const [submitting, setSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const { user } = useAuth();

    useEffect(() => {
        if (!open) {
            setPlaylistName("");
            setPlaylistDescription("");
            setVisibility("PUBLIC");
            setSubmitting(false);
        }
    }, [open]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const title = playlistName.trim();

        if (!title) {
            toast.error("Playlist name is required.");
            return;
        }

        try {
            setSubmitting(true);
            await playlistService.createPlaylist({
                title,
                description: playlistDescription.trim() || undefined,
                visibility,
            });
            queryClient.invalidateQueries({ 
                queryKey: ["user-playlists", user?.username] 
            });
            toast.success("Playlist created successfully.");
            onCreated?.();
            onClose();
        } catch (error) {
            console.error("Error creating playlist:", error);
            toast.error("Failed to create playlist.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-playlist-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="create-playlist-title" className="text-xl font-semibold">
                            Create Playlist
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Add a name, description, and visibility before saving.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close popup">
                        <span className="text-xl leading-none">×</span>
                    </Button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label htmlFor="playlist-name" className="text-sm font-medium">
                            Playlist name
                        </label>
                        <Input
                            id="playlist-name"
                            placeholder="My new playlist"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="playlist-description" className="text-sm font-medium">
                            Description
                        </label>
                        <Textarea
                            id="playlist-description"
                            placeholder="Write a short description..."
                            value={playlistDescription}
                            onChange={(e) => setPlaylistDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="playlist-visibility" className="text-sm font-medium">
                            Visibility
                        </label>
                        <select
                            id="playlist-visibility"
                            className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value as PlaylistVisibility)}
                        >
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                            <option value="UNLISTED">Unlisted</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} disabled={!playlistName.trim()}>
                            Create playlist
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}