"use client";

import { useAudio } from "@/providers/AudioProvider";
import { Volume2, VolumeOff, List } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

type SideControlProps = {
    IsQueue?: boolean;
    toggleQueueAction?: () => void;
};

export default function SideControl({ IsQueue, toggleQueueAction }: SideControlProps) {
    const {
        volume,
        setVolume,
    } = useAudio();

    async function handleVolume() {
        if (volume > 0) {
            setVolume(0);
        } else {
            setVolume(1);
        }
    }

    return (
        <div className="flex items-center gap-3">
            <Button
                size="icon"
                variant="ghost"
                onClick={toggleQueueAction}
                className={cn("transition-colors", 
                    IsQueue
                        ? "text-primary bg-primary/10 hover:bg-primary/15"
                        : "text-muted-foreground hover:bg-surface-hover hover:text-foreground"
                )}
            >
                <List
                    size={18}
                    className={cn(
                        IsQueue && "text-primary"
                    )}
                />
            </Button>
            <div className="flex items-center gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleVolume}
                >
                    {volume > 0 ? (
                        <Volume2 size={18} className="fill-white" />
                    ) : (
                        <VolumeOff size={18} className="fill-white" />
                    )}
                </Button>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                />
            </div>
        </div>
    );
}