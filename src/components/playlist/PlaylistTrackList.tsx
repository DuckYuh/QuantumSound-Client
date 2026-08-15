'use client'

import { use } from "react";
import { useAudio } from "@/providers/AudioProvider";
import { playlistService } from "@/services/playlist.service";
import { trackService } from "@/services/track.service";
import { Play, EllipsisVertical } from "lucide-react";
import { Button, Dropdown } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { Track } from "@/types/track";
import type { Playlist, PlaylistTrack } from "@/types/playlist";

interface Props { params: Promise<{ id: string }>; }

export default function PlaylistTrackList({ params }: Props) {
    const { id } = use(params);
    const { user } = useAuth();
    const { playTrack } = useAudio();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: playlist, isLoading } = useQuery<Playlist>({
        queryKey: queryKeys.playlist(id),
        queryFn: async () => (await playlistService.getPlaylist(id)).data,
    });
    const { data: tracks = [] } = useQuery<Track[]>({
        queryKey: queryKeys.playlistTracks(id),
        enabled: Boolean(playlist),
        queryFn: async () => {
            const hydrated = await Promise.all(playlist!.tracks.map(async ({ trackId }: PlaylistTrack) => {
                try { return (await trackService.getTrackById(trackId)).data as Track; }
                catch (error) { console.error("Error fetching playlist track:", error); return null; }
            }));
            return hydrated.filter((track): track is Track => Boolean(track));
        },
    });
    const removeTrackMutation = useMutation({
        mutationFn: (trackId: string) => playlistService.deleteTrackFromPlaylist(id, trackId),
        onSuccess: () => Promise.all([
            queryClient.invalidateQueries({ queryKey: queryKeys.playlist(id) }),
            queryClient.invalidateQueries({ queryKey: queryKeys.playlistTracks(id) }),
        ]),
    });
    const isOwner = playlist?.owner.id === user?.id;

    const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`;
    async function removeTrack(trackId: string) {
        try { await removeTrackMutation.mutateAsync(trackId); toast.success("Track removed from playlist."); }
        catch (error) { console.error("Error removing track from playlist:", error); toast.error("Failed to remove track from playlist."); }
    }
    async function moveToAlbum(trackId: string) {
        try { router.push(`/album/${(await trackService.getTrackById(trackId)).data.album.slug}`); }
        catch (error) { console.error("Error moving to album:", error); }
    }
    async function moveToArtist(trackId: string) {
        try { router.push(`/profile/${(await trackService.getTrackById(trackId)).data.artist.username}`); }
        catch (error) { console.error("Error moving to artist:", error); }
    }
    if (isLoading) return <div>Loading...</div>;
    return <div>
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[48px_minmax(0,1fr)_auto_auto] items-center p-2 border-b border-gray-700">
            <span className="font-bold text-center hidden lg:inline">
                #
            </span>
            <span className="font-bold">Track</span>
            <span className="font-bold justify-self-end pr-4 text-right hidden lg:inline">
                Album
            </span>
            <span className="font-bold text-right pr-6 hidden lg:inline">
                Duration
            </span>
        </div>
        {tracks.map((track, index) => 
            <div 
                key={track.id} 
                onClick={() => playTrack(track,tracks)}
                className="group grid grid-cols-[1fr_auto] lg:grid-cols-[48px_minmax(0,1fr)_auto_auto] items-center p-2 hover:bg-surface-hover lg:cursor-default"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg justify-self-center hidden lg:flex">
                    <div className="flex h-4 w-4 items-center justify-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <Play 
                            className="hidden size-4 group-hover:block fill-white" 
                            onClick={() => playTrack(track, tracks)} 
                        />
                    </div>
                </div>
                <span className="truncate">{track.title}</span>
                <div className="justify-self-end pr-10 text-right text-muted-foreground hidden lg:inline">
                    {track.album.title}
                </div>
                <div 
                    className="flex items-center justify-end gap-3 justify-self-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-right tabular-nums hidden lg:inline">
                        {track.duration && formatDuration(track.duration)}
                    </span>
                    <Dropdown 
                        className="bg-surface z-10" 
                        placement="top" 
                        trigger={
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <EllipsisVertical className="size-4" />
                            </Button>
                        } 
                        items={[
                            { 
                                label: "Move to Album", 
                                onClick: () => moveToAlbum(track.id) 
                            }, 
                            { 
                                label: "Move to Artist", 
                                onClick: () => moveToArtist(track.id) 
                            }, 
                            ...(isOwner ? [
                                { 
                                    label: "Remove from Playlist",
                                    onClick: () => removeTrack(track.id) 
                                }] : [])
                            ]}
                        />
                </div>
            </div>
        )}
    </div>;
}
