import { GripVertical, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Track } from "@/types/track";

type QueueItemProps = {
    track: Track;
    isCurrent: boolean;
    isPlaying: boolean;
    onPlay: () => void;
};

export default function QueueItem({ track, isCurrent, isPlaying, onPlay }: QueueItemProps) {
    const coverImage =
        track.coverImage ??
        track.album?.coverImage ??
        "/Logo512x512.png";

    return (
        <div
            className={cn(
                "group flex items-center gap-3 rounded-xl px-2 py-2",
                "transition-colors",
                isCurrent
                    ? "bg-surface-hover"
                    : "hover:bg-surface-hover"
            )}
        >
            {/* Drag handle - future */}
            <GripVertical
                className="
                    hidden size-4 shrink-0
                    text-muted-foreground
                "
            />

            {/* Cover */}
            <button
                type="button"
                onClick={onPlay}
                className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted"
                aria-label={
                    isPlaying
                        ? `Pause ${track.title}`
                        : `Play ${track.title}`
                }
            >
                <img
                    src={coverImage}
                    alt={track.title}
                    className="h-full w-full object-cover"
                />

                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/50",
                        isCurrent
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                    )}
                >
                    {isPlaying ? (
                        <Pause className="size-5 fill-white text-white" />
                    ) : (
                        <Play className="size-5 fill-white text-white" />
                    )}
                </div>
            </button>

            {/* Info */}
            <button
                type="button"
                onClick={onPlay}
                className="min-w-0 flex-1 text-left"
            >
                <p
                    className={cn(
                        "truncate text-sm font-medium",
                        isCurrent && "text-primary"
                    )}
                >
                    {track.title}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                    {track.artist?.displayName ?? "Unknown Artist"}
                </p>
            </button>
        </div>
    );
}