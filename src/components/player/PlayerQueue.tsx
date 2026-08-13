"use client";

import { Track } from "@/types/track";
import { useAudio } from "@/providers/AudioProvider";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type QueueBarProps = {
    queue: Track[];
};

export default function QueueBar({ queue }: QueueBarProps) {
    const { playTrack, isPlaying, togglePlay, currentTrack } = useAudio();

    const visibleQueue = currentTrack
        ? queue.slice(
            queue.findIndex((track) => track.id === currentTrack.id)
        )
        : queue;

    const handlePlay = (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
            return;
        }

        playTrack(track, queue);
    };

    return (
        <aside className="fixed right-0 top-[var(--spacing-navbar)] bottom-[var(--spacing-player)] z-30 hidden w-[var(--spacing-sidebar)] overflow-y-auto border-l border-border bg-background/90 backdrop-blur-xl lg:flex lg:flex-col">
            <div className="flex flex-col gap-2 p-4">
                <h2 className="text-lg font-semibold">Up Next</h2>
                {visibleQueue.map((track) => {
                    const isCurrent = currentTrack?.id === track.id;
                    return (
                        <div
                            key={track.id}
                            className={cn(
                                "group flex items-center gap-3 rounded-md p-2 transition-colors",
                                isCurrent
                                    ? "bg-surface-hover"
                                    : "hover:bg-surface-hover"
                            )}
                        >
                            {/* Cover */}
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                <img
                                    src={
                                        track.coverImage ||
                                        track.album.coverImage ||
                                        "/Logo512x512.png"
                                    }
                                    alt={track.title}
                                    className="h-full w-full object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        handlePlay(track)
                                    }
                                    className={cn(
                                        "absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
                                        isCurrent
                                            ? "opacity-100"
                                            : "opacity-0 group-hover:opacity-100"
                                    )}
                                    aria-label={
                                        isCurrent && isPlaying
                                            ? `Pause ${track.title}`
                                            : `Play ${track.title}`
                                    }
                                >
                                    {isCurrent && isPlaying ? (
                                        <Pause className="size-5 fill-white text-white" />
                                    ) : (
                                        <Play className="size-5 fill-white text-white" />
                                    )}
                                </button>
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                                <p
                                    className={cn(
                                        "truncate font-medium",
                                        isCurrent &&
                                            "text-primary"
                                    )}
                                >
                                    {track.title}
                                </p>

                                <p className="truncate text-sm text-muted-foreground">
                                    {track.artist.displayName}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}