"use client";

import { useState, useRef } from "react";
import { Playlist } from "@/types/playlist";
import { useRouter } from "next/navigation";
import { Loading, MediaCard, Button } from "@/components/ui";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { playlistService } from "@/services/playlist.service";
import PlaylistPopup from "@/components/playlist/PlaylistPopup";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

interface ProfileHeaderProps {
  targetUser: {
    username: string;
  };
}

export default function ProfilePlaylists({ targetUser }: ProfileHeaderProps) {
    const { data: userPlaylists = [], isLoading: loading } = useQuery<Playlist[]>({
        queryKey: queryKeys.userPlaylists(targetUser.username),
        queryFn: async () => (await playlistService.getUserPlaylists(targetUser.username)).data,
    });
    const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    const router = useRouter();

    async function handleCreatePlaylist() {
        setIsCreatePopupOpen(true);
    }

    if (loading) {
        return (
            <div>
                <div className="text-lg font-bold">Playlists</div>
                <Loading />
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <h2 className="text-lg font-bold items-center flex gap-2">
                            Playlists
                        </h2>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCreatePlaylist}
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
                <div 
                    ref={scrollRef} 
                    className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide" 
                >
                    {userPlaylists.map(playlist => (
                        <MediaCard
                            key={playlist.id}
                            type={"PLAYLIST"}
                            cover={playlist.coverImage ?? "/Logo512x512.png"}
                            title={playlist.title}
                            onClick={() => router.push(`/playlist/${playlist.id}`)}
                        />
                    ))}
                </div>
            </div>
            <PlaylistPopup
                open={isCreatePopupOpen}
                onClose={() => setIsCreatePopupOpen(false)}
                onCreated={() => undefined}
            />
        </>
    );
}
