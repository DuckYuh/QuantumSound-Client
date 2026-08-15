"use client";

import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";
import { useEffect, useState } from "react";
import { PlaylistSubmenu } from "@/components/playlist/PlaylistSubmenu";
import { Button, Dropdown } from "@/components/ui";
import { EllipsisVertical, Play, Heart } from "lucide-react"; 
import { useAudio } from "@/providers/AudioProvider";
import { useAuth } from "@/providers/AuthProvider";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";

export default function MostLikedTracks() {
    const [mostLikedTracks, setMostLikedTracks] = useState<Track[]>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [showAuthRequired, setShowAuthRequired] = useState(false);
    const { playTrack } = useAudio();
    const { user, loading } = useAuth();

    useEffect(() => {
        const fetchMostLikedTracks = async () => {
            try {
                const response = await trackService.getMostLikedTracks();
                setMostLikedTracks(response.data);
            } catch (error) {
                console.error("Error fetching most liked tracks:", error);
            }
        };

        fetchMostLikedTracks();
    }, []);

    function formatDuration(seconds: number) { 
        const minutes = Math.floor(seconds / 60); 
        const remainingSeconds = Math.floor(seconds % 60); 
        return `${minutes}:${remainingSeconds 
            .toString() 
            .padStart(2, "0")
        }`; 
    }

    function requireAuth(action: () => void) {
        if (loading) return;

        if (!user) {
            setShowAuthRequired(true);
            return;
        }

        action();
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold">Most Liked Tracks</h2>
            <div className="flex flex-col">
                {mostLikedTracks.slice(0, visibleCount).map((track, index) => (
                    <div 
                        key={track.id} 
                        className="group grid grid-cols-[1fr_auto] lg:grid-cols-[32px_1fr_100px_80px] lg:cursor-default items-center gap-3 lg:gap-4 rounded-md px-2 py-2 hover:bg-surface-hover cursor-pointer transition-colors"
                        onClick={() => requireAuth(() => playTrack(track, mostLikedTracks))}
                    >
                        <button 
                            type="button" 
                            onClick={() =>
                                requireAuth(() => playTrack(track, mostLikedTracks))
                            } 
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
                            <Heart className="size-4 inline-block mr-1" />
                            {track.likeCount}
                        </div>
                        <div 
                            className="flex items-center justify-end gap-3 justify-self-end"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span className="text-sm text-muted-foreground hidden lg:inline">{formatDuration(track.duration)}</span>
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
                                                    trackId={track.id}
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
                                    onClick={() => requireAuth(() => undefined)}
                                    aria-label="Open track actions"
                                >
                                    <EllipsisVertical className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {visibleCount < mostLikedTracks.length && (
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
            <AuthRequiredModal
                open={showAuthRequired}
                onCloseAction={() => setShowAuthRequired(false)}
                title="Login to use playback and actions"
                description="Please log in or create an account to play tracks and manage playlists."
            />
        </div>
    );
}