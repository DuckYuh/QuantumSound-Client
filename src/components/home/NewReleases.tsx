"use client";

import { Button, MediaCard } from "@/components/ui";
import { albumService } from "@/services/album.service";
import { Album } from "@/types/album";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function NewReleases() {
    const [newReleases, setNewReleases] = useState<Album[]>([]);
    const router = useRouter();
        const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;

        scrollRef.current.scrollBy({
            left: direction === "left" ? -320 : 320,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const fetchNewReleases = async () => {
            try {
                const response = await albumService.getNewReleases();
                setNewReleases(response.data);
            } catch (error) {
                console.error("Error fetching new releases:", error);
            }
        };

        fetchNewReleases();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    New Releases
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
                {newReleases.map(album => (
                    <MediaCard 
                        key={album.id}
                        type={album.type}
                        cover={album.coverImage??"/Logo512x512.png"}
                        title={album.title}
                        onClick={() => router.push(`/album/${album.slug}`)}
                    />
                ))}
            </div> 
        </div>
    );
}