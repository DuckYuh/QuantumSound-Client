'use client';

import { useEffect, useState } from "react";
import { albumService } from "@/services/album.service";
import { useRouter } from "next/navigation";
import { Album } from "@/types/album";

interface Props {
  targetAlbum: {
    id: string;
  };
}

export default function AlbumInfo({ targetAlbum }: Props) {
  const [albumResponse, setAlbumResponse] = useState<Album | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAlbum = async () => {
      const response = await albumService.getAlbumById(targetAlbum.id);
      setAlbumResponse(response.data);
    };
    fetchAlbum();
  }, [targetAlbum.id]);

  async function handleArtistClick() {
    router.push(`/profile/${albumResponse?.artist.username}`);
  }

  if (!albumResponse) return <div>Loading...</div>;

  return (
    <div className="relative bg-gradient-to-b from-[#222228] to-[#18181b] px-6 pt-6 pb-6 flex flex-col md:flex-row items-center gap-8">
      <div className="w-44 h-auto rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]">
        <img
          src={albumResponse.coverImage ?? "/Logo512x512.png"}
          alt={albumResponse.title}
          className="w-full h-full rounded-lg aspect-square object-cover transition group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col items-center md:items-start flex-1 w-full text-center md:text-left">
        <div className="absolute top-6 text-md text-color-foreground">
          {albumResponse.type}
        </div>
        <div className="text-8xl font-bold line-clamp-2">
          {albumResponse.title}
        </div>
        <div className="absolute bottom-6 text-md text-color-foreground hover:underline" onClick={handleArtistClick} style={{ cursor: "pointer" }}>
          {albumResponse.artist.username}
        </div>
      </div>
    </div>
  );
}