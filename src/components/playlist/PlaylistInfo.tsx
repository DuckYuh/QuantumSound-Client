'use client'

import { useEffect, useState } from "react";
import { playlistService } from "@/services/playlist.service";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types/playlist";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PlaylistInfo({ params }: Props) {
    const [playlist, setPlaylist] = useState<Playlist | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPlaylist = async () => {
            const { id } = await params;
            const response = await playlistService.getPlaylist(id);
            setPlaylist(response.data);
            setLoading(false);
        };
        fetchPlaylist();
      }, [params]);

    async function handleOwnerClick() {
        router.push(`/profile/${playlist?.owner.username}`);
    }

    if (!playlist) {
        return <div>Loading...</div>;
    }

    return (
        <div className="relative bg-gradient-to-b from-[#222228] to-[#18181b] px-6 pt-6 pb-6 flex flex-col md:flex-row items-center gap-8">
            <div className="w-44 h-auto rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]">
                <img
                    src={playlist.coverImage ?? "/Logo512x512.png"}
                    alt={playlist.title}
                    className="w-full h-full rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]"
                />
            </div>
            <div className="flex flex-col items-center md:items-start flex-1 w-full text-center md:text-left">
                <div className="absolute top-6 text-md text-color-foreground">
                    PLAYLIST
                </div>
                <div className="text-8xl font-bold line-clamp-2">
                    {playlist.title}
                </div>
                <div className="absolute bottom-6 text-md text-color-foreground hover:underline" onClick={handleOwnerClick} style={{ cursor: "pointer" }}>
                    {playlist.owner.displayName}
                </div>
            </div>
        </div>
    )
}