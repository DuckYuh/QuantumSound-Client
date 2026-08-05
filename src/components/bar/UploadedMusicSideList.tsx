'use client';

import { useEffect, useState } from "react";
import { Album } from "@/types/album";
import { albumService } from "@/services/album.service";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface UploadedMusicSideListProps {
  targetUser: {
    username: string;
  };
}

export default function UploadedMusicSideList({ targetUser }: UploadedMusicSideListProps) {
    const [uploadedMusics, setUploadedMusics] = useState<Album[]>([]);
    const [showAll, setShowAll] = useState(false);
    const router = useRouter();
    const displayedMusics = showAll ? uploadedMusics : uploadedMusics.slice(0, 3);

    async function onAlbumClick(slug: string) {
        router.push(`/album/${slug}`);
    }

    useEffect(() => {
        const fetchUploadedMusics = async () => {
            try {
                const response = await albumService.getUserAlbums(targetUser.username);
                setUploadedMusics(response.data);
            } catch (error) {
                console.error("Error fetching uploaded musics:", error);
            }
        };
        fetchUploadedMusics();
    }, [targetUser.username]);

    if (uploadedMusics.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 rounded-xl border border-border bg-surface-active/80 p-5"> 
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Uploaded Musics</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
                {displayedMusics.map((album) => (
                    <div key={album.id} className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded" onClick={() => onAlbumClick(album.slug)}>
                        <img
                            src={album.coverImage ?? "/Logo512x512.png"}
                            alt={album.title}
                            className="h-8 w-8 object-cover"
                        />
                        {album.title}
                    </div>
                ))}
            </div>
            {uploadedMusics.length > 3 && (
                <Button
                    onClick={() => setShowAll(!showAll)}
                    variant="text"
                >
                    {showAll ? "Show Less" : `More (+${uploadedMusics.length - 3})`}
                </Button>
            )}
        </div>
    );
}