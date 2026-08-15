"use client";

import { useQuery } from "@tanstack/react-query";
import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";
import { Loading } from "@/components/ui";
import { EllipsisVertical, Play, Eye } from "lucide-react"; 
import { useAudio } from "@/providers/AudioProvider";
import { toast } from "sonner";
import { PlaylistSubmenu } from "@/components/playlist/PlaylistSubmenu";
import { Button, Dropdown } from "@/components/ui";
import { queryKeys } from "@/lib/query-keys";
import { useState } from "react";

interface PopularTracksProps {
    targetUser?: {
        id: string;
        username: string;
    }
}

export default function PopularTracks({ targetUser }: PopularTracksProps) {
    const [visibleCount, setVisibleCount] = useState(5);
    const { data: popularTracks = [] } = useQuery<Track[]>({
        queryKey: queryKeys.popularTracks(targetUser?.id ?? ""),
        queryFn: async () => (await trackService.getPopularTracks(targetUser!.id)).data,
        enabled: Boolean(targetUser),
    });
    const { playTrack } = useAudio();

    function formatDuration(seconds: number) { 
        const minutes = Math.floor(seconds / 60); 
        const remainingSeconds = Math.floor(seconds % 60); 
        return `${minutes}:${remainingSeconds 
            .toString() 
            .padStart(2, "0")
        }`; 
    }

    if (!targetUser) {
        return (
            <div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Popular Tracks
                </h2>
            </div>
            <div className="flex flex-col">
                {popularTracks.slice(0, visibleCount).map((track, index) => (
                    <div 
                        key={track.id} 
                        className="group grid grid-cols-[1fr_auto] lg:grid-cols-[32px_1fr_100px_80px] lg:cursor-default items-center gap-3 lg:gap-4 rounded-md px-2 py-2 hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => playTrack(track, popularTracks)}
                    >
                        <button 
                            type="button" 
                            onClick={() => playTrack(track, popularTracks)} 
                            className="flex h-8 w-8 items-center justify-center rounded-full hidden lg:flex" 
                            aria-label={`Play ${track.title}`} 
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
                                    src={ track.album.coverImage ?? "/Logo512x512.png" } 
                                    alt={track.title} 
                                    className="h-full w-full object-cover" 
                                /> 
                            </div> 
                            <div className="min-w-0"> 
                                <p className="truncate font-medium"> {track.title} </p> 
                                <p className="truncate text-sm text-muted-foreground"> {track.artist.displayName} </p> 
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground hidden lg:block"> 
                            <Eye className="inline-block w-4 h-4 mr-1" />
                            {track.playCount} 
                        </div>
                        <div 
                            className="flex items-center justify-end gap-3 justify-self-end"
                            onClick={(e) => e.stopPropagation()}    
                        > 
                            <span className="text-sm text-muted-foreground hidden lg:inline">{formatDuration(track.duration)}</span>
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
                                                trackId={track.id}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < popularTracks.length && (
                <Button 
                    variant="outline"
                    size="sm"
                    className="self-center mt-2"
                    onClick={() => setVisibleCount(prev => prev + 5)}
                >
                    Show More
                </Button>
            )}
        </div>
    );
}
