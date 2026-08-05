'use client'

import { useEffect, useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { playlistService } from "@/services/playlist.service";
import { Playlist } from "@/types/playlist";
import { Track } from "@/types/track";
import { trackService } from "@/services/track.service";
import { Play, EllipsisVertical } from "lucide-react";
import { Button, Dropdown } from "@/components/ui";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PlaylistTrackList({ params }: Props) {
    const { play } = useAudio();
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);

    function formatDuration(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remain = seconds % 60;

        return `${minutes}:${remain.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const { id } = await params;
                const response = await playlistService.getPlaylist(id);
                const playlistData: Playlist = response.data;
                setPlaylist(playlistData);

                const hydratedTracks = await Promise.all(
                    playlistData.tracks.map(async (playlistTrack) => {
                        try {
                            const trackResponse = await trackService.getTrackById(playlistTrack.trackId);
                            return trackResponse.data as Track;
                        } catch (error) {
                            console.error("Error fetching playlist track:", error);
                            return null;
                        }
                    })
                );

                setTracks(hydratedTracks.filter((track): track is Track => Boolean(track)));
            } finally {
                setLoading(false);
            }
        }
        fetchPlaylist();
    }, [params]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center p-2 border-b border-gray-700">
                <span className="font-bold text-center">#</span>
                <span className="font-bold">Track</span>
                <span className="font-bold text-right pr-6">Duration</span>
            </div>
            {tracks.map((track, index) => (
                <div key={track.id} className="group grid grid-cols-[48px_minmax(0,1fr)_auto] items-center p-2 hover:bg-surface-hover">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg justify-self-center">
                        <div className="flex h-4 w-4 items-center justify-center">
                            <span className="group-hover:hidden">
                                {index + 1}
                            </span>
                            <Play
                                className="hidden size-4 group-hover:block fill-white"
                                onClick={() => play(track, tracks)}
                            />
                        </div>
                    </div>
                    <span className="truncate">{track.title}</span>
                    <div className="flex items-center justify-end gap-3 justify-self-end">
                        <span className="text-right tabular-nums">
                            {track.duration && formatDuration(track.duration)}
                        </span>
                        <Dropdown
                            className="bg-surface z-10"
                            trigger={
                                <Button size="sm" variant="ghost" className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                    <EllipsisVertical className="size-4" />
                                </Button>
                            }
                            items={[
                                {
                                    label: "xxx",
                                },
                            ]}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}