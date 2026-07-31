"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Pause, Play, SkipBack, SkipForward, } from "lucide-react";

export default function PlayerControls() {
    const {
        isPlaying,
        pause,
        resume,
        previous,
        next,
    } = useAudio();

    return (
        <div className="flex items-center gap-5">
            <SkipBack
                size={20}
                className="cursor-pointer"
                onClick={previous}
            />
            {isPlaying ? (
                <Pause
                    size={34}
                    className="cursor-pointer"
                    onClick={pause}
                />
            ) : (
                <Play
                    size={34}
                    className="cursor-pointer"
                    onClick={resume}
                />
            )}
            <SkipForward
                size={20}
                className="cursor-pointer"
                onClick={next}
            />
        </div>
    );
}