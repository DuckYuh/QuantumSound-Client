"use client";

import { trackService } from "@/services/track.service";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { TrackLike } from "@/types/track";
import { useAudio } from "@/providers/AudioProvider";
import { PlaylistSubmenu } from "@/components/playlist/PlaylistSubmenu";
import { Button, Dropdown } from "@/components/ui";
import { EllipsisVertical, Play } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";

export default function LikedTrack() {
    const { user } = useAuth();
    const { playTrack } = useAudio();
    const [visibleCount, setVisibleCount] = useState(5);
    const { data: likedTracks = [], isLoading } = useQuery<TrackLike[]>({
        queryKey: queryKeys.likedTracks(),
        queryFn: async () => {
            const response = await trackService.getLikedTracks();
            return response.data;
        },
    });

    function formatDuration(seconds: number) { 
        const minutes = Math.floor(seconds / 60); 
        const remainingSeconds = Math.floor(seconds % 60); 
        return `${minutes}:${remainingSeconds 
            .toString() 
            .padStart(2, "0")
        }`; 
    }

    if (isLoading) {
        return <div>Loading liked tracks...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Liked Tracks
                </h2>
            </div>
            <div className="flex flex-col">
                {likedTracks.length === 0 ? (
                    <p className="text-lg text-gray-600">You have no liked tracks.</p>
                ) : (
                    likedTracks.slice(0, visibleCount).map((trackLike, index) => (
                        <div 
                            key={trackLike.id} 
                            className="group grid grid-cols-[1fr_auto] lg:grid-cols-[32px_1fr_80px] lg:cursor-default items-center gap-3 lg:gap-4 rounded-md px-2 py-2 hover:bg-surface-hover cursor-pointer transition-colors"
                        >
                            <button 
                                type="button" 
                                onClick={() => playTrack(trackLike.track, likedTracks.map(like => like.track))}
                                className="flex h-8 w-8 items-center justify-center rounded-full hidden lg:flex" 
                                aria-label={`Play ${trackLike.track.title}`} 
                            > 
                                <span className="text-sm text-muted-foreground group-hover:hidden"> 
                                    {index + 1} 
                                </span> 
                                <Play 
                                    size={16} 
                                    fill="currentColor" 
                                    className="hidden group-hover:block" 
                                /> 
                            </button>
                            <div className="flex min-w-0 items-center gap-3"> 
                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md"> 
                                    <img 
                                        src={ trackLike.track.album.coverImage ?? "/Logo512x512.png" } 
                                        alt={trackLike.track.title} 
                                        className="h-full w-full object-cover" 
                                    /> 
                                </div> 
                                <div className="min-w-0"> 
                                    <p className="truncate font-medium"> {trackLike.track.title} </p> 
                                    <p className="truncate text-sm text-muted-foreground"> {trackLike.track.artist.displayName} </p> 
                                </div>
                            </div>
                            <div 
                                className="flex items-center justify-end gap-3 justify-self-end"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="text-sm text-muted-foreground hidden lg:inline">{formatDuration(trackLike.track.duration)}</span>
                                {user ? (
                                    <Dropdown
                                        className="bg-surface z-10"
                                        placement="top"
                                        trigger={
                                            <Button size="sm" variant="ghost" className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        }
                                        items={[
                                            {
                                                label: "Add to Playlist",
                                                submenu: (
                                                    <PlaylistSubmenu
                                                        trackId={trackLike.track.id}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                        onClick={() => undefined}
                                        aria-label="Open track actions"
                                    >
                                        <EllipsisVertical className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {visibleCount < likedTracks.length && (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={() => setVisibleCount((prev) => prev + 5)}
                        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-hover"
                    >
                        See more
                    </button>
                </div>
            )}
        </div>
    );
}