"use client";   

import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";
import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback, } from "react";

type RepeatMode = "off" | "all" | "one";

interface AudioContextType {
    currentTrack: Track | null;
    queue: Track[];
    currentIndex: number;

    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;

    shuffle: boolean;
    repeatMode: RepeatMode;
    
    playTrack: (track: Track, queue?: Track[]) => void;
    togglePlay: () => void;
    toggleShuffle: () => void;
    setRepeatMode: (mode: RepeatMode) => void;
    pause: () => void;
    resume: () => void;

    next(): void;
    previous(): void;

    seek(time: number): void;
    setVolume(volume: number): void;

    cycleRepeatMode: () => void;

    clearPlayer: () => void;
    removeTrack: (trackId: string) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children, }: { children: ReactNode; }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [queue, setQueue] = useState<Track[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);
    const [shuffle, setShuffle] = useState(false);
    const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
    const [playOrder, setPlayOrder] = useState<number[]>([]);
    const listenRecordedRef = useRef<string | null>(null);
    const recordingListenRef = useRef(false);

    function createShuffledOrder(length: number, currentIndex: number) {
        const indexes = Array.from(
            { length },
            (_, index) => index
        );

        const remaining = indexes.filter(
            (index) => index !== currentIndex
        );

        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(
                Math.random() * (i + 1)
            );

            [remaining[i], remaining[j]] = [
                remaining[j],
                remaining[i],
            ];
        }

        return [currentIndex, ...remaining];
    }

    const recordListen = async (trackId: string) => {
        if (listenRecordedRef.current === trackId) {
            return;
        }

        try {
            await trackService.recordListen(trackId);

            listenRecordedRef.current = trackId;
        } catch (error) {
            console.error(
                "Failed to record listen:",
                error
            );
        }
    };

    const playTrack = useCallback( (track: Track, newQueue?: Track[]) => { 
        const audio = audioRef.current; 

        if (!audio) return; 

        if (newQueue) {
            setQueue(newQueue);

            const index = newQueue.findIndex(
                (item) => item.id === track.id
            );

            const safeIndex = index >= 0 ? index : 0;

            setCurrentIndex(safeIndex);

            if (shuffle) {
                setPlayOrder(
                    createShuffledOrder(
                        newQueue.length,
                        safeIndex
                    )
                );
            } else {
                setPlayOrder(
                    Array.from(
                        { length: newQueue.length },
                        (_, index) => index
                    )
                );
            }
        } else { 
            const index = queue.findIndex( (item) => item.id === track.id ); 
            if (index >= 0) { 
                setCurrentIndex(index); 
            } 
        } 

        setCurrentTrack(track); 
        audio.src = track.audioUrl; 
        audio.currentTime = 0; 
        setCurrentTime(0); 
        setDuration(0); 
        audio 
            .play() 
            .then(() => { 
                setIsPlaying(true); 
            }) 
            .catch((error) => { 
                console.error("Failed to play audio:", error); 
                setIsPlaying(false); 
            }); 
    }, [queue]);
    const pause = useCallback(() => {
        const audio = audioRef.current; 
        if (!audio) return;
        audio.pause();
        setIsPlaying(false);
    }, []);

    const resume = useCallback(() => {
        const audio = audioRef.current; 
        if (!audio || !currentTrack) return;
        audio 
            .play() 
            .then(() => { 
                setIsPlaying(true); 
            }) .catch((error) => { 
                console.error("Failed to resume audio:", error); 
                setIsPlaying(false); 
            });
    }, [currentTrack]);

    const togglePlay = useCallback(() => {
        if (isPlaying) { 
            pause(); 
        } else { 
            resume(); 
        }
    }, [isPlaying, pause, resume]);

    const toggleShuffle = useCallback(() => {
        setShuffle((prev) => {
            const nextShuffle = !prev;

            if (nextShuffle) {
                setPlayOrder(
                    createShuffledOrder(
                        queue.length,
                        currentIndex
                    )
                );
            } else {
                setPlayOrder(
                    Array.from(
                        { length: queue.length },
                        (_, index) => index
                    )
                );
            }

            return nextShuffle;
        });
    }, [queue.length, currentIndex]);

    const cycleRepeatMode = useCallback(() => {
        setRepeatMode((prev) => {
            if (prev === "off") return "all";
            if (prev === "all") return "one";

            return "off";
        });
    }, []);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;

        if (!audio) return;

        const safeTime = Math.max( 0, Math.min(time, audio.duration || 0) );

        audio.currentTime = safeTime;
        setCurrentTime(safeTime);
    }, []);

    const setVolume = useCallback((value: number) => {
        const audio = audioRef.current;

        const safeVolume = Math.max(0, Math.min(value, 1));

        if (audio) { 
            audio.volume = safeVolume; 
        } 
        
        setVolumeState(safeVolume);
    }, []);

    const next = useCallback(() => {
        if (!queue.length) return;

        // Repeat one
        if (repeatMode === "one") {
            const audio = audioRef.current;

            if (!audio || !currentTrack) return;

            audio.currentTime = 0;

            audio
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => {
                    setIsPlaying(false);
                });

            return;
        }

        const order =
            shuffle && playOrder.length === queue.length
                ? playOrder
                : Array.from(
                    { length: queue.length },
                    (_, index) => index
                );

        const position = order.indexOf(currentIndex);

        if (position === -1) return;

        const nextPosition = position + 1;

        // End of queue
        if (nextPosition >= order.length) {
            // Repeat all
            if (repeatMode === "all") {
                const firstIndex = order[0];

                playTrack(queue[firstIndex], queue);

                return;
            }

            // Repeat off
            setIsPlaying(false);

            return;
        }

        const nextIndex = order[nextPosition];

        playTrack(queue[nextIndex], queue);
    }, [queue, currentIndex, currentTrack, shuffle, playOrder, repeatMode, playTrack]);

    const previous = useCallback(() => {
        if (!queue.length) return;

        const order =
            shuffle && playOrder.length === queue.length
                ? playOrder
                : Array.from(
                    { length: queue.length },
                    (_, index) => index
                );

        const position = order.indexOf(currentIndex);

        if (position === -1) return;

        // Nếu bài đang chạy quá 3 giây,
        // Previous nên đưa về đầu bài hiện tại.
        if (currentTime > 3) {
            seek(0);
            return;
        }

        const previousPosition = position - 1;

        if (previousPosition < 0) {
            if (repeatMode === "all") {
                const lastIndex =
                    order[order.length - 1];

                playTrack(queue[lastIndex], queue);
            }

            return;
        }

        const previousIndex =
            order[previousPosition];

        playTrack(queue[previousIndex], queue);
    }, [queue, currentIndex, shuffle, playOrder, repeatMode, currentTime, seek, playTrack]);

    const clearPlayer = useCallback(() => {
        const audio = audioRef.current;

        if (audio) { 
            audio.pause(); 
            audio.removeAttribute("src"); 
            audio.load(); 
        }

        setCurrentTrack(null); 
        setQueue([]); 
        setCurrentIndex(0);

        setIsPlaying(false); 
        setCurrentTime(0); 
        setDuration(0);
    }, []);

    const removeTrack = useCallback((trackId: string) => {
        const index = queue.findIndex(
            (track) => track.id === trackId
        );

        if (index === -1) return;

        if (trackId === currentTrack?.id) {
            clearPlayer();
            return;
        }

        setQueue((prev) =>
            prev.filter((track) => track.id !== trackId)
        );

        if (index < currentIndex) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [queue, currentTrack, currentIndex, clearPlayer]);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);

            if (!currentTrack) return;
            if (audio.paused) return;

            if (listenRecordedRef.current === currentTrack.id) {
                return;
            }

            const threshold =
                audio.duration < 60
                    ? audio.duration / 10
                    : 10;

            if (!audio.paused && audio.currentTime >= threshold) {
                recordListen(currentTrack.id);
            }
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handlePlay = () => { 
            setIsPlaying(true); 
        };
        const handlePause = () => { 
            setIsPlaying(false); 
        };
        const handleEnded = () => {
            next();
        };

        audio.addEventListener(
            "timeupdate", 
            handleTimeUpdate
        );

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener(
            "play", 
            handlePlay
        );
        audio.addEventListener(
            "pause", 
            handlePause
        );
        audio.addEventListener(
            "ended", 
            handleEnded
        );

        return () => {
            audio.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            audio.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            audio.removeEventListener(
                "ended",
                handleEnded
            );

            audio.removeEventListener(
                "play",
                handlePlay
            );

            audio.removeEventListener(
                "pause",
                handlePause
            );
        };
    }, [next]);

    useEffect(() => { 
        if (!audioRef.current) return; 
        audioRef.current.volume = volume; 
    }, [volume]);

    useEffect(() => {
        listenRecordedRef.current = null;
    }, [currentTrack?.id]);

    return (
        <AudioContext.Provider
            value={{
                currentTrack, 
                queue, 
                currentIndex, 
                isPlaying, 
                shuffle,
                repeatMode,
                currentTime, 
                duration, 
                volume, 
                playTrack, 
                togglePlay, 
                pause, 
                resume, 
                next, 
                previous, 
                seek, 
                setVolume, 
                clearPlayer,
                removeTrack,
                toggleShuffle,
                setRepeatMode,
                cycleRepeatMode,
            }}
        >
            {children}
            <audio ref={audioRef} preload="metadata"/>
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);

    if(!context){
        throw new Error("useAudio must be used within an AudioProvider");
    }

    return context;
}