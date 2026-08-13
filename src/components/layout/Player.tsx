"use client";

import { useAudio } from "@/providers/AudioProvider";
import PlayerControls from "@/components/player/PlayerControls";
import PlayerProgress from "@/components/player/PlayerProgress";
import SideControl from "@/components/player/PlayerSide";

type PlayerProps = {
    IsQueue?: boolean;
    toggleQueueAction?: () => void;
};

export default function Player({ IsQueue, toggleQueueAction }: PlayerProps) {
    const { currentTrack } = useAudio();

    const coverImage = currentTrack?.coverImage ?? currentTrack?.album?.coverImage ?? "/Logo512x512.png";

    const title = currentTrack?.title ?? "Title";
    const artistName = currentTrack?.artist?.displayName ?? "Artist Name";

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-24 items-center justify-between border-t border-border bg-background px-6">
            {/* Left */}
            <div className="flex w-1/4 items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                        src={coverImage}
                        alt={title}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0">
                    <div className="truncate font-medium">
                        {title}
                    </div>

                    <div className="truncate text-sm text-muted-foreground">
                        {artistName}
                    </div>
                </div>
            </div>

            {/* Center */}
            <div className="flex flex-1 flex-col items-center gap-2">
                <PlayerControls />
                <PlayerProgress />
            </div>

            {/* Right */}
            <div className="flex w-1/4 justify-end">
                <SideControl IsQueue={IsQueue} toggleQueueAction={toggleQueueAction} />
            </div>
        </div>
    );
}