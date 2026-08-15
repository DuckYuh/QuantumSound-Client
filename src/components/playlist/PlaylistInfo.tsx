"use client";

import { use, useState } from "react";
import { playlistService } from "@/services/playlist.service";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { Dropdown, Button } from "@/components/ui";
import PlaylistEditForm from "./PlaylistEditForm";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface Props {
    params: Promise<{ id: string }>;
}

export default function PlaylistInfo({ params }: Props) {
    const { user } = useAuth();
    const { id } = use(params);

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: playlist } = useQuery({
        queryKey: queryKeys.playlist(id),
        queryFn: async () =>
            (await playlistService.getPlaylist(id)).data,
    });

    const isOwner = playlist?.owner.id === user?.id;

    const deletePlaylist = useMutation({
        mutationFn: playlistService.deletePlaylist,

        onSuccess: async () => {
            if (!playlist) return;

            await queryClient.invalidateQueries({
                queryKey: queryKeys.myPlaylists(),
            });

            router.push(
                `/profile/${playlist.owner.username}`
            );
        },
    });

    async function handleDeletePlaylist() {
        if (!playlist) return;

        try {
            await deletePlaylist.mutateAsync(playlist.id);
        } catch (error) {
            console.error(
                "Error deleting playlist:",
                error
            );
        }
    }

    function handleEditPlaylist() {
        setIsEditPopupOpen(true);
    }

    function handleOwnerClick() {
        if (!playlist) return;

        router.push(
            `/profile/${playlist.owner.username}`
        );
    }

    if (!playlist) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div
                className="
                    relative
                    flex flex-col items-center
                    gap-5
                    overflow-hidden
                    bg-gradient-to-b from-[#222228] to-[#18181b]
                    px-4 py-6

                    sm:px-6 sm:py-7

                    md:flex-row
                    md:items-end
                    md:gap-7
                    md:px-8 md:py-8
                "
            >
                {/* Cover */}
                <div
                    className="
                        relative
                        size-40 shrink-0
                        overflow-hidden
                        rounded-xl
                        shadow-xl

                        sm:size-44

                        md:size-52
                        lg:size-60
                    "
                >
                    <img
                        src={
                            playlist.coverImage ??
                            "/Logo512x512.png"
                        }
                        alt={playlist.title}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Playlist information */}
                <div
                    className="
                        flex min-w-0 w-full
                        flex-col items-center
                        text-center

                        md:items-start
                        md:text-left
                    "
                >
                    {/* Type */}
                    <span
                        className="
                            mb-2
                            text-xs font-bold uppercase
                            tracking-[0.18em]
                            text-muted-foreground

                            md:text-sm
                        "
                    >
                        PLAYLIST
                    </span>

                    {/* Title */}
                    <h1
                        className="
                            max-w-full
                            line-clamp-2
                            font-black
                            leading-[0.95]
                            tracking-tight

                            text-3xl

                            sm:text-4xl

                            md:text-6xl

                            lg:text-7xl
                        "
                    >
                        {playlist.title}
                    </h1>

                    {/* Owner */}
                    <button
                        type="button"
                        onClick={handleOwnerClick}
                        className="
                            mt-3
                            max-w-full
                            truncate
                            text-sm font-medium
                            text-muted-foreground
                            transition-colors
                            hover:text-foreground
                            hover:underline

                            md:mt-4
                            md:text-base
                        "
                    >
                        {playlist.owner.displayName}
                    </button>
                </div>

                {/* Settings */}
                {isOwner && (
                    <div
                        className="
                            absolute
                            right-3 top-3

                            sm:right-5 sm:top-5

                            md:right-6 md:top-6
                        "
                    >
                        <Dropdown
                            className="z-20 bg-surface"
                            trigger={
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Playlist settings"
                                >
                                    <Settings className="size-5 md:size-6" />
                                </Button>
                            }
                            items={[
                                {
                                    label: "Edit Playlist",
                                    onClick:
                                        handleEditPlaylist,
                                },
                                {
                                    label: "Delete Playlist",
                                    onClick:
                                        handleDeletePlaylist,
                                },
                            ]}
                        />
                    </div>
                )}
            </div>

            <PlaylistEditForm
                playlistId={playlist.id}
                open={isEditPopupOpen}
                onClose={() =>
                    setIsEditPopupOpen(false)
                }
                onEdited={() => {
                    setIsEditPopupOpen(false);
                    router.refresh();
                }}
            />
        </>
    );
}