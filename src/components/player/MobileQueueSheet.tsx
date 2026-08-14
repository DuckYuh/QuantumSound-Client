"use client";

import { useAudio } from "@/providers/AudioProvider";
import QueueItem from "./QueueItem";
import PopHeader from "@/components/bar/PopHeader";

type MobileQueueSheetProps = {
    onCloseAction: () => void;
};

export default function MobileQueueSheet({
    onCloseAction,
}: MobileQueueSheetProps) {
    const {
        queue,
        currentTrack,
        isPlaying,
        playTrack,
    } = useAudio();

    if (!queue.length) {
        return (
            <div className="fixed inset-0 z-[120] lg:hidden">
                {/* Backdrop */}
                <button
                    type="button"
                    aria-label="Close queue"
                    onClick={onCloseAction}
                    className="absolute inset-0 bg-black/50"
                />

                {/* Sheet */}
                <section className="absolute inset-x-0 bottom-0 max-h-[75vh] rounded-t-2xl border-t border-border bg-background shadow-2xl" >
                    <PopHeader Head="Up Next" onCloseAction={onCloseAction} />

                    <div className="flex h-40 items-center justify-center px-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Your queue is empty.
                        </p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[120] lg:hidden">
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close queue"
                onClick={onCloseAction}
                className="absolute inset-0 bg-black/50"
            />

            {/* Sheet */}
            <section className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-hidden rounded-t-2xl border-t border-border bg-background shadow-2xl" >
                <PopHeader Head="Up Next" onCloseAction={onCloseAction} />

                <div className="max-h-[calc(80vh-72px)] overflow-y-auto px-3 pb-6">
                    {queue.map((track) => {
                        const isCurrent =
                            currentTrack?.id === track.id;

                        return (
                            <QueueItem
                                key={track.id}
                                track={track}
                                isCurrent={isCurrent}
                                isPlaying={isCurrent && isPlaying}
                                onPlay={() => playTrack(track)}
                            />
                        );
                    })}
                </div>
            </section>
        </div>
    );
}