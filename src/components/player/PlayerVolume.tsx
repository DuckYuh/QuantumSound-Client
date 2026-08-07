"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Volume2 } from "lucide-react";

export default function VolumeControl() {
    const {
        volume,
        setVolume,
    } = useAudio();

    return (
        <div className="flex items-center gap-3">
            <Volume2 size={18} className="fill-white" />
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
            />
        </div>
    );
}