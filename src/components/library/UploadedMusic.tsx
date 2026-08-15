"use client";

import { albumService } from "@/services/album.service";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { Album } from "@/types/album";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, MediaCard } from "@/components/ui";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
    const router = useRouter();
    const { data: albums = [], isLoading } = useQuery<Album[]>({
        queryKey: queryKeys.myAlbums(),
        queryFn: async () => {
            const response = await albumService.getMyAlbums();
            return response.data;
        },
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    if (isLoading) {
        return <div>Loading albums...</div>;
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
                {albums.length === 0 ? (
                    <p className="text-lg text-gray-600">You have no uploaded albums.</p>
                ) : (
                    albums.map((album) => (
                        <MediaCard
                            key={album.id}
                            type={album.type}
                            cover={album.coverImage ?? "/Logo512x512.png"}
                            title={album.title}
                            onClick={() => router.push(`/album/${album.slug}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}