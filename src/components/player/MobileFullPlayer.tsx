"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Heart, MessageCircle, ArrowDown, ListMusic, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, EllipsisVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { trackService } from "@/services/track.service";
import MobileQueueSheet from "@/components/player/MobileQueueSheet";
import MobileCommentSheet from "@/components/comment/MobileCommentSheet";

type MobileFullPlayerProps = {
    onCloseAction: () => void;
};

export default function MobileFullPlayer({ onCloseAction, }: MobileFullPlayerProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isQueueOpen, setIsQueueOpen] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const { currentTrack, isPlaying, togglePlay, next, previous, currentTime, duration, seek, repeatMode, shuffle, cycleRepeatMode, toggleShuffle, } = useAudio();

    function formatTime(time: number) {
        if (!time) return "0:00";
        const minute = Math.floor(time / 60);
        const second = Math.floor(time % 60);
        return `${minute}:${second.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        if (!currentTrack) return;
        const fetchStatus = async () => {
            try {
                const likes = await trackService.getIsLiked(currentTrack.id);
                setIsLiked(likes.data);
            } catch (error) {
                console.error("Failed to get like status:", error);
            }
        }
        fetchStatus();
    }, [currentTrack]);

    if (!currentTrack) {
        return null;
    }

    const handleLike = async () => {
        if (!currentTrack) return;

        try {
            if (isLiked) {
                await trackService.unlikeTrack(currentTrack.id);
                setIsLiked(false);
            } else {
                await trackService.likeTrack(currentTrack.id);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Failed to toggle like status:", error);
        }
    };

    const coverImage =
        currentTrack.coverImage ??
        currentTrack.album?.coverImage ??
        "/Logo512x512.png";

    const title = currentTrack.title;

    const artistName =
        currentTrack.artist?.displayName ??
        "Unknown Artist";

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        seek(Number(event.target.value));
    };

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-background lg:hidden">
                <div className="flex h-full flex-col px-5 pb-8 pt-5">
                    {/* Header */}
                    <div className="flex h-10 items-center justify-between">
                        <button
                            type="button"
                            onClick={onCloseAction}
                            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground "
                            aria-label="Close player"
                        >
                            <ArrowDown className="size-6" />
                        </button>

                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Now Playing
                        </span>

                        <button
                            type="button"
                            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                            aria-label="More options"
                        >
                            <EllipsisVertical className="size-5" />
                        </button>
                    </div>

                    {/* Main content */}
                    <div className="flex min-h-0 flex-1 flex-col justify-center pt-8">
                        {/* Cover */}
                        <div className="mx-auto w-full max-w-[320px]">
                            <div className="aspect-square overflow-hidden rounded-2xl bg-muted shadow-2xl">
                                <img
                                    src={coverImage}
                                    alt={title}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Track information */}
                        <div className="mt-8 min-w-0 flex justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-2xl font-bold">
                                    {title}
                                </h1>

                                <p className="mt-1 truncate text-base text-muted-foreground">
                                    {artistName}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={handleLike}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                        isLiked 
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:bg-surface-hover"
                                    )}
                                    aria-label={isLiked ? "Unlike track" : "Like track"}
                                >
                                    <Heart className="size-6" />
                                </button>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="mt-7">
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={Math.min(currentTime, duration || 0)}
                                onChange={handleSeek}
                                disabled={!duration}
                                className="w-full accent-primary"
                                aria-label="Track progress"
                            />

                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Main controls */}
                        <div className="mt-7 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={toggleShuffle}
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-full transition-colors",
                                    shuffle
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                aria-label={
                                    shuffle
                                        ? "Disable shuffle"
                                        : "Enable shuffle"
                                }
                            >
                                <Shuffle className="size-5" />
                            </button>

                            <button
                                type="button"
                                onClick={previous}
                                className="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-surface-hover"
                                aria-label="Previous track"
                            >
                                <SkipBack className="size-6 fill-current" />
                            </button>

                            <button
                                type="button"
                                onClick={togglePlay}
                                className="flex size-16 items-center justify-center rounded-full bg-foreground text-background transition-transform active:scale-95"
                                aria-label={
                                    isPlaying
                                        ? `Pause ${title}`
                                        : `Play ${title}`
                                }
                            >
                                {isPlaying ? (
                                    <Pause className="size-7 fill-current" />
                                ) : (
                                    <Play className="ml-1 size-7 fill-current" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={next}
                                className="flex size-12 items-center justify-center rounded-full transition-colors hover:bg-surface-hover"
                                aria-label="Next track"
                            >
                                <SkipForward className="size-6 fill-current" />
                            </button>

                            <button
                                type="button"
                                onClick={cycleRepeatMode}
                                className={cn(
                                    "flex size-10 items-center justify-center rounded-full transition-colors",
                                    repeatMode !== "off"
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                                aria-label={`Repeat mode: ${repeatMode}`}
                            >
                                {repeatMode === "one" ? (
                                    <Repeat1 className="size-5" />
                                ) : (
                                    <Repeat className="size-5" />
                                )}
                            </button>
                        </div>

                        {/* Secondary controls */}
                        <div className="mt-8 flex items-center justify-center gap-8">
                            
                            <button
                                type="button"
                                onClick={() => setIsCommentOpen(true)}
                                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Open Comments"
                            >
                                <MessageCircle className="size-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsQueueOpen(true)}
                                className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Open queue"
                            >
                                <ListMusic className="size-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isQueueOpen && (
                <MobileQueueSheet
                    onCloseAction={() => setIsQueueOpen(false)}
                />
            )}
            {isCommentOpen && (
                <MobileCommentSheet 
                    trackId={currentTrack.id}
                    onCloseAction={() => setIsCommentOpen(false)}
                />
            )}
        </>
    );
}