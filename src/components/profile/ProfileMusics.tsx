"use client";

import { useState, useEffect } from "react";
import { albumService } from "@/services/album.service";
import { Loading } from "@/components/ui";
import { Album } from "@/types/album";

interface ProfileHeaderProps {
  targetUser: {
    username: string;
  };
}

export default function ProfileMusics({ targetUser }: ProfileHeaderProps) {
    const [userAlbums, setUserAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

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
            <div className="text-lg font-bold">Uploaded Musics</div>
            <div className="flex flex-col gap-2">
                {userAlbums.map((album) => (
                    <div key={album.slug} className="p-2 border rounded">
                        <div className="font-semibold">{album.title}</div>
                        <div className="text-sm text-gray-500">{album.type}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}