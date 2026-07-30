"use client";

import { Loading } from "@/components/ui";

export default function ProfilePlaylists({targetUser}: {targetUser?: any}) {
    return (
        <div className="flex flex-col gap-4">
            <div className="text-lg font-bold">Playlists</div>
            <Loading />
        </div>
    );
}