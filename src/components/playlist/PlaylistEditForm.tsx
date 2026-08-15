"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { playlistService } from "@/services/playlist.service";
import { toast } from "sonner";
import { Playlist } from "@/types/playlist";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type PlaylistVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";

interface PlaylistPopupProps {
    playlistId: string;
    open: boolean;
    onClose: () => void;
    onEdited?: () => void;
}

export default function PlaylistEditForm({ playlistId, open, onClose, onEdited, }: PlaylistPopupProps) {
    const [playlistName, setPlaylistName] = useState("");
    const [playlistDescription, setPlaylistDescription] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [visibility, setVisibility] = useState<PlaylistVisibility>("PUBLIC");

    const queryClient = useQueryClient();

    const { data: playlist } = useQuery<Playlist>({
        queryKey: queryKeys.playlist(playlistId),
        queryFn: async () => (await playlistService.getPlaylist(playlistId)).data,
        enabled: open,
    });

    const updatePlaylist = useMutation({
        mutationFn: (data: Parameters<typeof playlistService.updatePlaylist>[1]) => playlistService.updatePlaylist(playlistId, data),

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.playlist(playlistId), }),
                queryClient.invalidateQueries({ queryKey: queryKeys.myPlaylists(), }),
            ]);
        },
    });

    useEffect(() => {
        if (!open || !playlist) return;

        setPlaylistName(playlist.title);
        setPlaylistDescription(playlist.description ?? "");
        setVisibility(playlist.visibility ?? "PUBLIC");
        setCoverImage(null);
    }, [open, playlist]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const title = playlistName.trim();

        if (!title) {
            toast.error("Playlist name is required.");
            return;
        }

        try {
            await updatePlaylist.mutateAsync({
                title,
                description: playlistDescription.trim() || undefined,
                visibility,
                coverImage: coverImage || undefined,
            });

            toast.success("Playlist updated successfully.");

            onEdited?.();
        } catch (error) {
            toast.error("Failed to update playlist.");
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-end justify-center
                bg-black/60
                backdrop-blur-sm
                pb-16
                sm:items-center
                sm:px-4 sm:py-6
            "
            role="presentation"
            onClick={onClose}
        >
            <div
                className="
                    flex
                    max-h-[92dvh]
                    w-full
                    flex-col
                    overflow-hidden
                    rounded-t-3xl
                    border border-border
                    bg-background
                    shadow-2xl
                    sm:max-w-3xl
                    sm:rounded-3xl
                "
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-playlist-title"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="
                        flex shrink-0
                        items-start justify-between
                        gap-4
                        border-b border-border
                        px-5 py-4
                        sm:px-6 sm:py-5
                    "
                >
                    <div className="min-w-0">
                        <h2
                            id="edit-playlist-title"
                            className="text-lg font-semibold sm:text-xl"
                        >
                            Edit Playlist
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                                sm:text-sm
                            "
                        >
                            Update your playlist
                            information and cover.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0"
                    >
                        <span className="text-xl leading-none">
                            ×
                        </span>
                    </Button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable content */}
                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            px-5 py-5
                            sm:px-6 sm:py-6
                        "
                    >
                        <div
                            className="
                                flex flex-col
                                gap-6
                                md:flex-row
                                md:items-start
                                md:gap-8
                            "
                        >
                            {/* Cover */}
                            <div
                                className="
                                    flex
                                    w-full
                                    flex-col
                                    items-center
                                    gap-3
                                    md:w-48
                                    md:shrink-0
                                "
                            >
                                <label
                                    className="
                                        self-start
                                        text-sm
                                        font-medium
                                        md:self-center
                                    "
                                >
                                    Cover Image
                                </label>

                                <div
                                    className="
                                        aspect-square
                                        w-44
                                        overflow-hidden
                                        rounded-xl
                                        bg-muted
                                        shadow-md
                                        sm:w-48
                                    "
                                >
                                    <img
                                        src={
                                            coverImage
                                                ? URL.createObjectURL(coverImage)
                                                : playlist?.coverImage ?? "/Logo512x512.png"
                                        }
                                        alt="Playlist cover preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="w-full"
                                    onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
                                />

                                <p
                                    className="text-center text-xs text-muted-foreground"
                                >
                                    JPG, PNG or WEBP
                                </p>
                            </div>

                            {/* Fields */}
                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-1
                                    flex-col
                                    gap-4
                                "
                            >
                                {/* Playlist name */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="playlist-name"
                                        className="text-sm font-medium"
                                    >
                                        Playlist Name
                                    </label>

                                    <Input
                                        id="playlist-name"
                                        value={playlistName}
                                        onChange={(event) => setPlaylistName(event.target.value)}
                                        placeholder="Enter playlist name"
                                        className="w-full"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="playlist-description"
                                        className="text-sm font-medium"
                                    >
                                        Description
                                    </label>

                                    <Textarea
                                        id="playlist-description"
                                        value={playlistDescription}
                                        onChange={(event) => setPlaylistDescription(event.target.value)}
                                        placeholder="Tell listeners about this playlist..."
                                        className="min-h-28 w-full resize-none"
                                    />
                                </div>

                                {/* Visibility */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="playlist-visibility"
                                        className="text-sm font-medium"
                                    >
                                        Visibility
                                    </label>

                                    <select
                                        id="playlist-visibility"
                                        value={visibility}
                                        onChange={(event) => setVisibility(event.target.value as PlaylistVisibility)}
                                        className="
                                            h-10
                                            w-full
                                            rounded-lg
                                            border
                                            border-border
                                            bg-background
                                            px-3
                                            text-sm
                                            outline-none
                                            transition-colors
                                            focus:border-primary
                                        "
                                    >
                                        <option value="PUBLIC">
                                            Public
                                        </option>

                                        <option value="PRIVATE">
                                            Private
                                        </option>

                                        <option value="UNLISTED">
                                            Unlisted
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="
                            flex
                            shrink-0
                            flex-col-reverse
                            gap-2
                            border-t border-border
                            bg-background
                            px-5 py-4
                            sm:flex-row
                            sm:justify-end
                            sm:gap-3
                            sm:px-6
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={updatePlaylist.isPending}
                            disabled={!playlistName.trim()}
                            className="w-full sm:w-auto"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}