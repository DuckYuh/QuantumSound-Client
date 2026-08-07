'use client';

import { Album } from "@/types/album";
import { useState } from "react";
import AlbumInfo from "./AlbumInfo";
import AlbumTrackList from "./AlbumTrackList";

export default function AlbumPageClient({ album }: { album: Album }) {
    const [editingOrder, setEditingOrder] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <AlbumInfo
                targetAlbum={album}
                editingOrder={editingOrder}
                onToggleEditOrder={() => setEditingOrder((prev) => !prev)}
            />

            <AlbumTrackList
                targetAlbum={album}
                editingOrder={editingOrder}
                onToggleEditOrder={() => setEditingOrder((prev) => !prev)}
            />
        </div>
    );
}