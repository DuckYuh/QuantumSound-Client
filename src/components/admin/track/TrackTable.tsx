"use client";

import { Track } from "@/types/track";
import TrackActions from "./TrackActions";

type TrackTableProps = {
    tracks: Track[];
};

export default function TrackTable({ tracks }: TrackTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                        <th className="px-4 py-3 font-medium">
                            Track
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Artist
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Album
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Status
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Visibility
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Plays
                        </th>

                        <th className="px-4 py-3 font-medium">
                            Likes
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
                    {tracks.map((track) => (
                        <tr
                            key={track.id}
                            className="border-b border-border last:border-0"
                        >
                            {/* Track */}
                            <td className="px-4 py-4">
                                <div className="min-w-[180px]">
                                    <p className="font-medium">
                                        {track.title}
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {track.slug}
                                    </p>
                                </div>
                            </td>

                            {/* Artist */}
                            <td className="px-4 py-4">
                                <div className="min-w-[120px]">
                                    <p className="font-medium">
                                        {track.artist.displayName}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                        @{track.artist.username}
                                    </p>
                                </div>
                            </td>

                            {/* Album */}
                            <td className="px-4 py-4">
                                <span className="text-muted-foreground">
                                    {track.album?.title || "—"}
                                </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-4">
                                <StatusBadge status={track.status} />
                            </td>

                            {/* Visibility */}
                            <td className="px-4 py-4">
                                <VisibilityBadge
                                    visibility={track.visibility}
                                />
                            </td>

                            {/* Plays */}
                            <td className="px-4 py-4 text-muted-foreground">
                                {track.playCount.toLocaleString()}
                            </td>

                            {/* Likes */}
                            <td className="px-4 py-4 text-muted-foreground">
                                {track.likeCount.toLocaleString()}
                            </td>

                            {/* Created */}
                            <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                                {new Date(
                                    track.createdAt
                                ).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-4 text-right">
                                <TrackActions track={track} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: Track["status"];
}) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {status}
        </span>
    );
}

function VisibilityBadge({
    visibility,
}: {
    visibility: Track["visibility"];
}) {
    return (
        <span className="inline-flex rounded-full border border-border px-2.5 py-1 text-xs font-medium">
            {visibility}
        </span>
    );
}