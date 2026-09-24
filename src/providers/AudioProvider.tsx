"use client";

import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from "react";

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

function isPlayInterruptedError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const [queue, setQueue] = useState<Track[]>([]);

  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolumeState] = useState(1);

  const [shuffle, setShuffle] = useState(false);

  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  const listenRecordedRef = useRef<string | null>(null);

  const recordingListenRef = useRef(false);

  const createShuffledQueue = useCallback(
    (tracks: Track[], current: Track): Track[] => {
      const remaining = tracks.filter((track) => track.id !== current.id);

      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }

      return [current, ...remaining];
    },
    [],
  );

  const recordListen = async (trackId: string) => {
    if (listenRecordedRef.current === trackId) {
      return;
    }

    if (recordingListenRef.current) {
      return;
    }

    recordingListenRef.current = true;

    try {
      await trackService.recordListen(trackId);

      listenRecordedRef.current = trackId;
    } catch (error) {
      console.error("Failed to record listen:", error);
    } finally {
      recordingListenRef.current = false;
    }
  };

  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      const audio = audioRef.current;

      if (!audio) return;

      if (newQueue) {
        const incomingQueue = [...newQueue];

        setOriginalQueue(incomingQueue);

        if (shuffle) {
          const shuffledQueue = createShuffledQueue(incomingQueue, track);

          setQueue(shuffledQueue);

          setCurrentIndex(0);
        } else {
          const index = incomingQueue.findIndex((item) => item.id === track.id);

          const safeIndex = index >= 0 ? index : 0;

          setQueue(incomingQueue);

          setCurrentIndex(safeIndex);
        }
      } else {
        const index = queue.findIndex((item) => item.id === track.id);

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
          if (!isPlayInterruptedError(error)) {
            console.error("Failed to play audio:", error);
          }

          setIsPlaying(false);
        });
    },
    [queue, shuffle, createShuffledQueue],
  );

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      return;
    }

    audio
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        if (!isPlayInterruptedError(error)) {
          console.error("Failed to resume audio:", error);
        }

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
    if (!currentTrack || queue.length <= 1) {
      setShuffle((prev) => !prev);

      return;
    }

    setShuffle((prev) => {
      const nextShuffle = !prev;

      if (nextShuffle) {
        if (originalQueue.length === 0) {
          setOriginalQueue([...queue]);
        }

        const shuffledQueue = createShuffledQueue(queue, currentTrack);

        setQueue(shuffledQueue);

        setCurrentIndex(0);

        return true;
      }

      const restoredQueue = originalQueue.length > 0 ? originalQueue : queue;

      const restoredIndex = restoredQueue.findIndex(
        (track) => track.id === currentTrack.id,
      );

      setQueue([...restoredQueue]);

      setCurrentIndex(restoredIndex >= 0 ? restoredIndex : 0);

      return false;
    });
  }, [queue, originalQueue, currentTrack, createShuffledQueue]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") {
        return "all";
      }

      if (prev === "all") {
        return "one";
      }

      return "off";
    });
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    const safeTime = Math.max(0, Math.min(time, audio.duration || 0));

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
    if (!queue.length) {
      return;
    }

    if (repeatMode === "one") {
      const audio = audioRef.current;

      if (!audio || !currentTrack) {
        return;
      }

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

    const nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        if (shuffle && currentTrack) {
          const shuffledQueue = createShuffledQueue(queue, currentTrack);

          setQueue(shuffledQueue);

          setCurrentIndex(0);

          const nextTrack = shuffledQueue[1];

          if (!nextTrack) {
            return;
          }

          setCurrentTrack(nextTrack);

          setCurrentIndex(1);

          const audio = audioRef.current;

          if (!audio) {
            return;
          }

          audio.src = nextTrack.audioUrl;

          audio.currentTime = 0;

          setCurrentTime(0);
          setDuration(0);

          audio
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              if (!isPlayInterruptedError(error)) {
                console.error("Failed to play audio:", error);
              }

              setIsPlaying(false);
            });

          return;
        }

        playTrack(queue[0]);

        return;
      }

      setIsPlaying(false);

      return;
    }

    playTrack(queue[nextIndex]);
  }, [
    queue,
    currentIndex,
    currentTrack,
    shuffle,
    repeatMode,
    createShuffledQueue,
    playTrack,
  ]);

  const previous = useCallback(() => {
    if (!queue.length) {
      return;
    }

    if (currentTime > 3) {
      seek(0);

      return;
    }

    const previousIndex = currentIndex - 1;

    if (previousIndex < 0) {
      if (repeatMode === "all") {
        const lastIndex = queue.length - 1;

        playTrack(queue[lastIndex]);
      }

      return;
    }

    playTrack(queue[previousIndex]);
  }, [queue, currentIndex, repeatMode, currentTime, seek, playTrack]);

  const clearPlayer = useCallback(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();

      audio.removeAttribute("src");

      audio.load();
    }

    setCurrentTrack(null);

    setQueue([]);

    setOriginalQueue([]);

    setCurrentIndex(0);

    setIsPlaying(false);

    setCurrentTime(0);

    setDuration(0);

    setShuffle(false);
  }, []);

  const removeTrack = useCallback(
    (trackId: string) => {
      const index = queue.findIndex((track) => track.id === trackId);

      if (index === -1) {
        return;
      }

      if (trackId === currentTrack?.id) {
        clearPlayer();

        return;
      }

      setQueue((prev) => prev.filter((track) => track.id !== trackId));

      setOriginalQueue((prev) => prev.filter((track) => track.id !== trackId));

      if (index < currentIndex) {
        setCurrentIndex((prev) => prev - 1);
      }
    },
    [queue, currentTrack, currentIndex, clearPlayer],
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      if (!currentTrack) {
        return;
      }

      if (audio.paused) {
        return;
      }

      if (listenRecordedRef.current === currentTrack.id) {
        return;
      }

      const threshold = audio.duration < 60 ? audio.duration / 10 : 10;

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

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    audio.addEventListener("play", handlePlay);

    audio.addEventListener("pause", handlePause);

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);

      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);

      audio.removeEventListener("play", handlePlay);

      audio.removeEventListener("pause", handlePause);

      audio.removeEventListener("ended", handleEnded);
    };
  }, [next, currentTrack]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

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
        currentTime,
        duration,
        volume,

        shuffle,
        repeatMode,

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

      <audio ref={audioRef} preload="metadata" />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);

  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }

  return context;
}
