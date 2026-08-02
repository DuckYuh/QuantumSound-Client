"use client";

import { useState, useEffect, useRef } from "react";
import { albumService } from "@/services/album.service";
import { Button, Loading, MediaCard } from "@/components/ui";
import { Album } from "@/types/album";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProfileHeaderProps {
  targetUser: {
    username: string;
  };
}

export default function ProfileMusics({ targetUser }: ProfileHeaderProps) {
    const [userAlbums, setUserAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    const router = useRouter();

    async function fetchUserAlbums() {
        try {
            setLoading(true);
            const response = await albumService.getUserAlbums(targetUser.username);
            setUserAlbums(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user albums:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("fetch albums");
        fetchUserAlbums();
    }, [targetUser.username]);

    if (loading) {
        return (
            <div>
                <div className="text-lg font-bold">Uploaded Musics</div>
                <Loading />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Uploaded Musics
                </h2>

                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => scroll("left")}
                    >
                        <ChevronLeft className="size-4" />
                    </Button>

                    <Button
                        size="icon"
                        variant="outline"
                        onClick={() => scroll("right")}
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>
            <div 
                ref={scrollRef} 
                className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide" 
            >
                {userAlbums.map(album => (
                    <MediaCard
                        key={album.id}
                        type={album.type}
                        cover={album.coverImage ?? "/Logo512x512.png"}
                        title={album.title}
                        onClick={() => router.push(`/album/${album.slug}`)}
                    />
                ))}
            </div>
        </div>
    );
}