"use client";

import { playlistService } from "@/services/playlist.service";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import type { Playlist } from "@/types/playlist";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, MediaCard } from "@/components/ui";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Playlist() {
    const router = useRouter();
    const { data: playlists = [], isLoading } = useQuery<Playlist[]>({
        queryKey: queryKeys.myPlaylists(),
        queryFn: async () => {
            const response = await playlistService.getMyPlaylists();
            return response.data;
        },
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    
    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
    
        scrollRef.current.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    if (isLoading) {
        return <div>Loading playlists...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Playlists
                </h2>

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
                {playlists.length === 0 ? (
                    <p className="text-lg text-gray-600">You have no playlists.</p>
                ) : (
                    playlists.map((playlist) => (
                        <MediaCard
                            key={playlist.id}
                            type={"PLAYLIST"}
                            cover={playlist.coverImage ?? "/Logo512x512.png"}
                            title={playlist.title}
                            onClick={() => router.push(`/playlist/${playlist.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}