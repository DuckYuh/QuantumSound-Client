"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, } from "lucide-react";
import { Button } from "@/components/ui";

export default function PlayerControls() {
    const {
        isPlaying,
        pause,
        resume,
        previous,
        next,
        shuffle,
        repeatMode,
        toggleShuffle,
        cycleRepeatMode,
        queue,
    } = useAudio();

    

    return (
        <div className="flex items-center gap-5">
            <Button
                variant="ghost"
                size="icon"
                disabled={queue.length === 0}
                className={shuffle ? "text-primary" : ""}
                onClick={toggleShuffle}
            >
                <Shuffle size={18} />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={queue.length === 0}
                onClick={previous}
            >
                <SkipBack
                    size={20}
                    className="cursor-pointer fill-white"
                />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={queue.length === 0}
                onClick={isPlaying ? pause : resume}
            >
                {isPlaying ? (
                    <Pause
                        size={34}
                        className="cursor-pointer fill-white"
                    />
                ) : (
                    <Play
                        size={34}
                        className="cursor-pointer fill-white"
                    />
                )}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                disabled={queue.length === 0}
                onClick={next}
            >
                <SkipForward
                    size={20}
                    className="cursor-pointer fill-white"
                />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className={
                    repeatMode !== "off"
                        ? "text-primary"
                        : ""
                }
                onClick={cycleRepeatMode}
                disabled={queue.length === 0}
            >
                {repeatMode === "one" ? (
                    <Repeat1 size={18} />
                ) : (
                    <Repeat size={18} />
                )}
            </Button>
        </div>
    );
}