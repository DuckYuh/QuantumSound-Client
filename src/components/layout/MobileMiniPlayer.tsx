"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Pause, Play, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileMiniPlayerProps = {
    onOpenAction?: () => void;
};

export default function MobileMiniPlayer({ onOpenAction, }: MobileMiniPlayerProps) {
    const { currentTrack, isPlaying, togglePlay, next, currentTime, duration, } = useAudio();

    if (!currentTrack) {
        return null;
    }

    const coverImage =
        currentTrack.coverImage ??
        currentTrack.album?.coverImage ??
        "/Logo512x512.png";

    const title = currentTrack.title;

    const artistName =
        currentTrack.artist?.displayName ??
        "Unknown Artist";

    const progress =
        duration > 0
            ? Math.min((currentTime / duration) * 100, 100)
            : 0;

    return (
        <div className="fixed inset-x-0 bottom-16 z-40 lg:hidden border-t border-border bg-background/95 backdrop-blur-xl" >
            {/* Progress */}
            <div className="absolute inset-x-0 top-0 h-0.5 bg-muted">
                <div
                    className="h-full bg-primary transition-[width]"
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <div className="flex h-16 items-center gap-3 px-3">
                {/* Cover */}
                <button
                    type="button"
                    onClick={onOpenAction}
                    className="size-12 shrink-0 overflow-hidden rounded-md bg-muted"
                    aria-label={`Open ${title}`}
                >
                    <img
                        src={coverImage}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                </button>

                {/* Track info */}
                <button
                    type="button"
                    onClick={onOpenAction}
                    className="min-w-0 flex-1 text-left"
                >
                    <p className="truncate text-sm font-medium">
                        {title}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                        {artistName}
                    </p>
                </button>

                {/* Play / Pause */}
                <button
                    type="button"
                    onClick={togglePlay}
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center",
                        "rounded-full",
                        "hover:bg-surface-hover",
                        "transition-colors"
                    )}
                    aria-label={
                        isPlaying
                            ? `Pause ${title}`
                            : `Play ${title}`
                    }
                >
                    {isPlaying ? (
                        <Pause className="size-5 fill-current" />
                    ) : (
                        <Play className="size-5 fill-current" />
                    )}
                </button>

                {/* Next */}
                <button
                    type="button"
                    onClick={next}
                    className="
                        flex size-10 shrink-0
                        items-center justify-center
                        rounded-full
                        text-muted-foreground
                        hover:bg-surface-hover
                        hover:text-foreground
                        transition-colors
                    "
                    aria-label="Next track"
                >
                    <SkipForward className="size-5" />
                </button>
            </div>
        </div>
    );
}