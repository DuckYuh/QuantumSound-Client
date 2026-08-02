'use client';

import { useEffect, useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { trackService } from "@/services/track.service";
import { Button } from "@/components/ui";
import { Track } from "@/types/track";
import { Play } from "lucide-react";

interface Props {
    targetAlbum: {
        id: string;
    };
}

export default function AlbumTrackList({ targetAlbum }: Props) {
    const { play } = useAudio();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    function formatDuration(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remain = seconds % 60;

        return `${minutes}:${remain.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        async function fetchTracks() {
            try {
                const res = await trackService.findAlbumTracks(targetAlbum.id);
                setTracks(res.data);
            } finally {
                setLoading(false);
            }
        }

        fetchTracks();
    }, [targetAlbum.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-[48px_minmax(0,1fr)_72px] items-center p-2 border-b border-gray-700">
                <span className="font-bold text-center">#</span>
                <span className="font-bold">Track</span>
                <span className="font-bold text-right">Duration</span>
            </div>
            {tracks.map((track) => (
                <div key={track.id} className="grid grid-cols-[48px_minmax(0,1fr)_72px] items-center p-2">
                    <div className="group flex h-8 w-8 items-center justify-center rounded-lg hover:bg-accent justify-self-center">
                        <div className="flex h-4 w-4 items-center justify-center">
                            <span className="group-hover:hidden">
                                {track.trackNumber}
                            </span>
                            <Play
                                className="hidden size-4 group-hover:block fill-white"
                                onClick={() => play(track, tracks)}
                            />
                        </div>
                    </div>
                    <span className="truncate">{track.title}</span>
                    <span className="text-right">
                        {track.duration && formatDuration(track.duration)}
                    </span>
                </div>
            ))}
        </div>
    );
}