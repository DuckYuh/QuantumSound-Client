'use client'

import { useEffect, useRef, useState } from "react";
import { playlistService } from "@/services/playlist.service";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types/playlist";
import { Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Dropdown, Button } from "@/components/ui";
import PlaylistEditForm from "./PlaylistEditForm";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PlaylistInfo({ params }: Props) {
    const { user } = useAuth();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const isOwner = playlist?.owner.id === user?.id;
    const router = useRouter();
    const queryClient = useQueryClient();

    async function handleDeletePlaylist() {
        if (!playlist) return;

        try {
            await playlistService.deletePlaylist(playlist.id);
            router.push(`/profile/${playlist?.owner.username}`);
            queryClient.invalidateQueries({
                queryKey: ["user-playlists", playlist?.owner.username],
            });
        } catch (error) {
            console.error("Error deleting playlist:", error);
        }
    }

    async function handleEditPlaylist() {
        setIsEditPopupOpen(true);
    }

    useEffect(() => {
        const fetchPlaylist = async () => {
            const { id } = await params;
            const response = await playlistService.getPlaylist(id);
            setPlaylist(response.data);
            setLoading(false);
        };
        fetchPlaylist();
      }, [params]);

    async function handleOwnerClick() {
        router.push(`/profile/${playlist?.owner.username}`);
    }

    if (!playlist) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="relative bg-gradient-to-b from-[#222228] to-[#18181b] px-6 pt-6 pb-6 flex flex-col md:flex-row items-center gap-8">
                <div className="w-44 h-auto rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]">
                    <img
                        src={playlist.coverImage ?? "/Logo512x512.png"}
                        alt={playlist.title}
                        className="w-full h-full rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]"
                    />
                </div>
                <div className="flex flex-col items-center md:items-start flex-1 w-full text-center md:text-left">
                    <div className="absolute top-6 text-md text-color-foreground">
                        PLAYLIST
                    </div>
                    <div className="text-8xl font-bold line-clamp-2">
                        {playlist.title}
                    </div>
                    <div className="absolute bottom-6 text-md text-color-foreground hover:underline" onClick={handleOwnerClick} style={{ cursor: "pointer" }}>
                        {playlist.owner.displayName}
                    </div>
                </div>
                {isOwner && (
                    <div className="absolute top-6 right-6 z-10">
                        <Dropdown 
                            className="bg-surface"
                            trigger={
                                <Button variant="outline" size="sm">
                                    <Settings className="w-6 h-6" />
                                </Button>
                            }
                            items={[
                                {
                                    label: "Edit Playlist",
                                    onClick: handleEditPlaylist,
                                },
                                {
                                    label: "Delete Playlist",
                                    onClick: handleDeletePlaylist,
                                },
                            ]}
                        />
                    </div>
                )}
            </div>
            <PlaylistEditForm
                playlistId={playlist.id}
                open={isEditPopupOpen}
                onClose={() => setIsEditPopupOpen(false)}
                onEdited={() => {
                    setIsEditPopupOpen(false);
                    router.refresh();
                }}
            />
        </>
    )
}