"use client";   

import { Track } from "@/types/track";
import { createContext, useContext, useEffect, useState, ReactNode, useRef, } from "react";

interface AudioContextType {
    currentTrack: Track | null;
    playlist: Track[];
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    play(track: Track): void;
    pause(): void;
    resume(): void;
    next(): void;
    previous(): void;
    seek(time: number): void;
    setVolume(volume: number): void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children, }: { children: ReactNode; }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolumeState] = useState(1);

    async function play(track: Track, list?: Track[]) {
        if (!audioRef.current) return;
        if (list) {
            setPlaylist(list);
        }
        setCurrentTrack(track);
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
    }

    function pause() {
        if (!audioRef.current) return;
        audioRef.current.pause();
        setIsPlaying(false);
    }

    function resume() {
        if (!audioRef.current) return;
        audioRef.current.play();
        setIsPlaying(true);
    }

    function seek(time: number) {
        if (!audioRef.current) return;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    }

    function setVolume(volume: number) {
        if (!audioRef.current) return;
        audioRef.current.volume = volume;
        setVolumeState(volume);
    }

    function next() {
        if (!currentTrack) return;
        const index = playlist.findIndex(
            (track) => track.id === currentTrack.id
        );
        if (index === -1) return;
        if (index >= playlist.length - 1) return;
        play(playlist[index + 1], playlist);
    }

    function previous() {
        if (!currentTrack) return;
        const index = playlist.findIndex(
            (track) => track.id === currentTrack.id
        );
        if (index <= 0) return;
        play(playlist[index - 1], playlist);
    }

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };
        const handleEnded = () => {
            next();
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);

        audio.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        audio.addEventListener("ended", handleEnded);

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
        };
    }, [currentTrack, playlist]);

    return (
        <AudioContext.Provider
            value={{
                currentTrack,
                playlist,
                isPlaying,
                currentTime,
                duration,
                volume,
                play,
                pause,
                resume,
                next,
                previous,
                seek,
                setVolume,
            }}
        >
            {children}
            <audio ref={audioRef} />
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