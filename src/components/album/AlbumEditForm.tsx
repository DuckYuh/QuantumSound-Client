'use client';

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { albumService } from "@/services/album.service";
import { toast } from "sonner";
import { Album } from "@/types/album";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type AlbumStatus = "PROCESSING" | "READY" | "BLOCKED" | "DELETED";

interface AlbumPopupProps {
    albumId: string;
    open: boolean;
    onClose: () => void;
    onEdited?: () => void;
}

export default function AlbumEditForm({ albumId, open, onClose, onEdited }: AlbumPopupProps) {
    const [albumName, setAlbumName] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [status, setStatus] = useState<AlbumStatus>("PROCESSING");
    const [submitting, setSubmitting] = useState(false);
    const [album, setAlbum] = useState<Album | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!open) return;

        async function loadAlbum() {
            const CurrentAlbum = await albumService.getAlbumById(albumId);
            setAlbum(CurrentAlbum.data);
            setAlbumName(album?.title || "");
            setAlbumDescription(album?.description ?? "");
            setStatus(album?.status || "READY");
        }

        loadAlbum();
    }, [open, albumId, album?.title, album?.description, album?.status]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const title = albumName.trim();

        if (!title) {
            toast.error("Album name is required.");
            return;
        }

        setSubmitting(true);
        try {
            const newAlbum = await albumService.updateAlbum(albumId, {
                title,
                description: albumDescription.trim() || undefined,
                type: album?.type,
                status,
                coverImage: coverImage || undefined,
            });
            toast.success("Album updated successfully.");
            onEdited?.();
            queryClient.invalidateQueries({ 
                queryKey: ["user-albums", album?.artist.username] 
            });
            router.push(`/album/${newAlbum.data.slug}`);
        } catch (error) {
            toast.error("Failed to update album.");
        } finally {
            setSubmitting(false);
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl rounded-3xl border border-border bg-background p-6 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-playlist-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2 id="edit-album-title" className="text-xl font-semibold">
                            Edit Album
                        </h2>
                        <p className="mt-1 text-sm text-muted">
                            Edit name, description, cover image, and status.
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close popup">
                        <span className="text-xl leading-none">×</span>
                    </Button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-start space-x-8 mt-2">
                        <div className="flex flex-col items-center space-y-2 w-48">
                            <label className="text-lg font-medium">Avatar</label>
                            <img
                                src={coverImage ? URL.createObjectURL(coverImage) : "/Logo512x512.png"}
                                alt="Cover Image"
                                className="w-full h-auto rounded-lg"
                            />
                            <Input
                                type="file"
                                accept="image/*"
                                className="w-full"
                                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                            />
                        </div>
                        <div className="flex flex-col items-start space-y-3 flex-1 max-w-2xl">
                            <label className="text-sm font-medium">Album Name</label>
                            <Input
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                                className="w-full max-w-xl"
                            />

                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={albumDescription}
                                onChange={(e) => setAlbumDescription(e.target.value)}
                                className="w-full max-w-xl h-28"
                            />
                            <label className="text-sm font-medium">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as AlbumStatus)}
                                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                            >
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="READY">READY</option>
                                <option value="BLOCKED">BLOCKED</option>
                                <option value="DELETED">DELETED</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} disabled={!albumName.trim()} >
                            Confirm
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}