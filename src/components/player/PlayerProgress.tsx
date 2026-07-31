"use client";

import { useAudio } from "@/providers/AudioProvider";

function format(time: number) {
    if (!time) return "0:00";
    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60);
    return `${minute}:${second.toString().padStart(2, "0")}`;
}

export default function PlayerProgress() {
    const {
        currentTime,
        duration,
        seek,
    } = useAudio();

    return (
        <div className="flex items-center gap-3 w-full">
            <span className="text-xs">
                {format(currentTime)}
            </span>
            <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1"
            />
            <span className="text-xs">
                {format(duration)}
            </span>
        </div>
    );
}