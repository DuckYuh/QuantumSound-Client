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
import EditTrackForm from "./EditTrackForm";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

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
    const { playTrack } = useAudio();

    const [orderedTracks, setOrderedTracks] = useState<Track[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);
    const [editingTrack, setEditingTrack] = useState<Track | null>(null);

    const queryClient = useQueryClient();

    const { data: tracks = EMPTY_TRACKS, isLoading } = useQuery<Track[]>({
        queryKey: queryKeys.albumTracks(targetAlbum.id),
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
            // Keep the draft order aligned while reorder mode is closed.
            // eslint-disable-next-line react-hooks/set-state-in-effect
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

    const reorderTracks = useMutation({
        mutationFn: (trackIds: string[]) => albumService.reOrderAlbumTracks(targetAlbum.id, trackIds),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.albumTracks(targetAlbum.id) }),
    });
    const deleteTrack = useMutation({
        mutationFn: trackService.deleteTrack,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.albumTracks(targetAlbum.id) }),
    });

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

        try {
            await reorderTracks.mutateAsync(nextIds);

            toast.success("Track order updated successfully.");
            onToggleEditOrder();
        } catch {
            toast.error("Failed to update track order.");
        } finally { setSavingOrder(false); }
    }

    async function handleDeleteTrack(trackId: string) {
        try {
            await deleteTrack.mutateAsync(trackId);

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
            <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[48px_minmax(0,1fr)_auto_auto] items-center p-2 border-b border-gray-700">
                <span className="font-bold text-center hidden lg:inline">
                    #
                </span>
                <span className="font-bold">Track</span>
                <span className="font-bold justify-self-end pr-4 text-right hidden lg:inline">
                    Plays
                </span>
                <span className="font-bold text-right pr-6 hidden lg:inline">
                    Duration
                </span>
            </div>
            {(editingOrder ? orderedTracks : tracks).map((track, index) => (
                <Dropdown
                    key={track.id} 
                    className="bg-surface z-10"
                    portal
                    openOnContextMenu={!editingOrder}
                    triggerClassName="block w-full"
                    trigger={
                        <div 
                            onClick={() => playTrack(track, tracks)}
                            className="group grid grid-cols-[1fr_auto] lg:grid-cols-[48px_minmax(0,1fr)_auto_auto] items-center p-2 hover:bg-surface-hover lg:cursor-default"
                        >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg justify-self-center hidden lg:flex">
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
                                        onClick={() => playTrack(track, tracks)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <span className="truncate">{track.title}</span>
                    <div className="text-muted-foreground text-sm justify-self-end pr-10 text-right hidden lg:inline-flex">
                        {track.playCount}
                    </div>
                    <div 
                        className="flex items-center justify-end gap-3 justify-self-end"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span className="text-right tabular-nums hidden lg:inline">
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
                                portal
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
                                            onClick: () => setEditingTrack(track),
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
                    }
                    items={[
                        { label: "Add to Playlist", submenu: <PlaylistSubmenu trackId={track.id} /> },
                        ...(isOwner ? [{ label: "Edit Track", onClick: () => setEditingTrack(track) }] : []),
                        ...(isOwner ? [{ label: "Delete Track", onClick: () => handleDeleteTrack(track.id) }] : []),
                    ]}
                />
            ))}
            <EditTrackForm
                key={editingTrack?.id ?? "closed"}
                track={editingTrack}
                open={editingTrack !== null}
                onClose={() => setEditingTrack(null)}
                onEdited={() => setEditingTrack(null)}
            />
        </div>
    );
}
