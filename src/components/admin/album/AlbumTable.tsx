"use client";

import { Album } from "@/types/album";
import AlbumActions from "./AlbumActions";

type AlbumTableProps = {
    albums: Album[];
};

export default function AlbumTable({
    albums,
}: AlbumTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="px-4 py-3 font-medium">
                            Album
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Artist
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Type
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Tracks
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Status
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Created
                        </th>

                        <th className="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {albums.map((album) => (
                        <tr
                            key={album.id}
                            className="border-b border-border last:border-0"
                        >
                            {/* Album */}
                            <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                                        {album.coverImage ? (
                                            <img
                                                src={album.coverImage}
                                                alt={album.title}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                                                —
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-[160px]">
                                        <p className="font-medium">
                                            {album.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {album.slug}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* Artist */}
                            <td className="px-4 py-4">
                                <div className="min-w-[120px]">
                                    <p className="font-medium">
                                        {album.artist.displayName}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        @{album.artist.username}
                                    </p>
                                </div>
                            </td>

                            {/* Type */}
                            <td className="px-4 py-4">
                                <TypeBadge type={album.type} />
                            </td>

                            {/* Tracks */}
                            <td className="px-4 py-4 text-muted-foreground">
                                {album.tracks?.length ?? 0}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                                <StatusBadge status={album.status} />
                            </td>

                            {/* Created */}
                            <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                                {new Date(
                                    album.createdAt
                                ).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                                <AlbumActions album={album} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function TypeBadge({
    type,
}: {
    type: Album["type"];
}) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {type}
        </span>
    );
}

function StatusBadge({
    status,
}: {
    status: Album["status"];
}) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {status}
        </span>
    );
}