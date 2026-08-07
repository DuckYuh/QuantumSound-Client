'use client';

import { useEffect, useState } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { useAuth } from "@/providers/AuthProvider";
import { albumService } from "@/services/album.service";
import { trackService } from "@/services/track.service";
import { Track } from "@/types/track";
import { ArrowDown, ArrowUp, Play, EllipsisVertical } from "lucide-react";
import { Button, Dropdown } from "@/components/ui";
import { PlaylistSubmenu } from "@/components/playlist/PlaylistSubmenu";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_TRACKS: Track[] = [];

interface Props {
    targetAlbum: {
        id: string;
    };
    editingOrder: boolean;
    onToggleEditOrder: () => void;
}

export default function AlbumTrackList({ targetAlbum, editingOrder, onToggleEditOrder }: Props) {
    const { user } = useAuth();
    const { play } = useAudio();

    const [orderedTracks, setOrderedTracks] = useState<Track[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);

    const queryClient = useQueryClient();

    const { data: tracks = EMPTY_TRACKS, isLoading } = useQuery<Track[]>({
        queryKey: ["album-tracks", targetAlbum.id],
        queryFn: async () => {
            const res = await trackService.findAlbumTracks(targetAlbum.id);
            return res.data;
        },
    });

    const isOwner =
        tracks.length > 0 &&
        tracks[0].artist.id === user?.id;

    function formatDuration(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remain = seconds % 60;

        return `${minutes}:${remain.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        if (!editingOrder) {
            setOrderedTracks(tracks);
        }
    }, [tracks, editingOrder]);

    function moveTrack(index: number, direction: -1 | 1) {
        setOrderedTracks((current) => {
            const nextIndex = index + direction;

            if (nextIndex < 0 || nextIndex >= current.length) {
                return current;
            }

            const nextTracks = [...current];
            [nextTracks[index], nextTracks[nextIndex]] = [nextTracks[nextIndex], nextTracks[index]];
            return nextTracks;
        });
    }

    function closeEditMode() {
        setOrderedTracks(tracks);
        onToggleEditOrder();
    }

    async function handleSaveOrder() {
        if (!editingOrder) {
            return;
        }

        const currentIds = tracks.map((track) => track.id);
        const nextIds = orderedTracks.map((track) => track.id);
        const isSameOrder = currentIds.length === nextIds.length && currentIds.every((id, index) => id === nextIds[index]);

        if (isSameOrder) {
            closeEditMode();
            return;
        }

        setSavingOrder(true);
        try {
            await albumService.reOrderAlbumTracks(targetAlbum.id, nextIds);

            await queryClient.invalidateQueries({
                queryKey: ["album-tracks", targetAlbum.id],
            });

            toast.success("Track order updated successfully.");
            onToggleEditOrder();
        } catch (error) {
            toast.error("Failed to update track order.");
        } finally {
            setSavingOrder(false);
        }
    }

    async function handleDeleteTrack(trackId: string) {
        try {
            await trackService.deleteTrack(trackId);

            await queryClient.invalidateQueries({
                queryKey: ["album-tracks", targetAlbum.id],
            });

            toast.success("Track deleted successfully.");
        } catch {
            toast.error("Failed to delete track.");
        }
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {editingOrder && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                    <div>
                        <div className="font-medium">Reorder tracks</div>
                        <div className="text-sm text-muted-foreground">
                            Use the arrows to change order, then save.
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={closeEditMode} disabled={savingOrder}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSaveOrder} loading={savingOrder} disabled={orderedTracks.length === 0}>
                            Save order
                        </Button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center p-2 border-b border-gray-700">
                <span className="font-bold text-center">#</span>
                <span className="font-bold">Track</span>
                <span className="font-bold text-right pr-6">Duration</span>
            </div>
            {(editingOrder ? orderedTracks : tracks).map((track, index) => (
                <div key={track.id} className="group grid grid-cols-[48px_minmax(0,1fr)_auto] items-center p-2 hover:bg-surface-hover">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg justify-self-center">
                        <div className="flex h-4 w-4 items-center justify-center">
                            {editingOrder ? (
                                <span>{index + 1}</span>
                            ) : (
                                <>
                                    <span className="group-hover:hidden">
                                        {index + 1}
                                    </span>
                                    <Play
                                        className="hidden size-4 fill-white group-hover:block"
                                        onClick={() => play(track, tracks)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <span className="truncate">{track.title}</span>
                    <div className="flex items-center justify-end gap-3 justify-self-end">
                        <span className="text-right tabular-nums">
                            {track.duration && formatDuration(track.duration)}
                        </span>
                        {editingOrder ? (
                            <div className="flex items-center gap-1">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9"
                                    onClick={() => moveTrack(index, -1)}
                                    disabled={index === 0}
                                    aria-label="Move track up"
                                >
                                    <ArrowUp className="size-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="h-9 w-9"
                                    onClick={() => moveTrack(index, 1)}
                                    disabled={index === orderedTracks.length - 1}
                                    aria-label="Move track down"
                                >
                                    <ArrowDown className="size-4" />
                                </Button>
                            </div>
                        ) : (
                            <Dropdown
                                className="bg-surface z-10"
                                placement="top"
                                trigger={
                                    <Button size="sm" variant="ghost" className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                                        <EllipsisVertical className="size-4" />
                                    </Button>
                                }
                                items={[
                                    {
                                        label: "Add to Playlist",
                                        submenu: (
                                            <PlaylistSubmenu
                                                trackId={track.id}
                                            />
                                        ),
                                    },
                                    ...(isOwner ? [
                                        {
                                            label: "Edit Track",
                                        }
                                    ] : []),
                                    ...(isOwner ? [
                                        {
                                            label: "Delete Track",
                                            onClick: () => handleDeleteTrack(track.id),
                                        }
                                    ] : []),
                                ]}
                            />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}