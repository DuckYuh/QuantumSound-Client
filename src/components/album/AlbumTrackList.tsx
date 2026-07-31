'use client';

import { useEffect, useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { trackService } from "@/services/track.service";
import { Button } from "@/components/ui";
import { Track } from "@/types/track";

interface Props {
    targetAlbum: {
        id: string;
    };
}

export default function AlbumTrackList({ targetAlbum }: Props) {
    const { play } = useAudio();

    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

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
            <div>Album Tracks</div>

            {tracks.map((track) => (
                <div key={track.id}>
                    {track.trackNumber}. {track.title}
                    <Button
                        onClick={() => play(track)}
                    >
                        Play
                    </Button>
                </div>
            ))}
        </div>
    );
}