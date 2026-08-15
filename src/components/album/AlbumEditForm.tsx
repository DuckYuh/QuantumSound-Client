"use client";

import { useEffect, useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { albumService } from "@/services/album.service";
import { toast } from "sonner";
import { Album } from "@/types/album";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient, } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

type AlbumStatus = "PROCESSING" | "RELEASED" | "BLOCKED";

interface AlbumPopupProps {
    albumId: string;
    open: boolean;
    onClose: () => void;
    onEdited?: () => void;
}

export default function AlbumEditForm({ albumId, open, onClose, onEdited, }: AlbumPopupProps) {
    const [albumName, setAlbumName] = useState("");
    const [albumDescription, setAlbumDescription] = useState("");
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [status, setStatus] = useState<AlbumStatus>("PROCESSING");

    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: album } = useQuery<Album>({
        queryKey: queryKeys.album(albumId),
        queryFn: async () => (await albumService.getAlbumById(albumId)).data,
        enabled: open,
    });

    const updateAlbum = useMutation({
        mutationFn: (data: Parameters<typeof albumService.updateAlbum>[1]) => albumService.updateAlbum(albumId, data),
        onSuccess: async (response) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: queryKeys.album(albumId), }),
                queryClient.invalidateQueries({ queryKey: queryKeys.myAlbums(), }),
            ]);

            router.push(`/album/${response.data.slug}`);
        },
    });

    useEffect(() => {
        if (!open || !album) return;

        setAlbumName(album.title);
        setAlbumDescription(album.description ?? "");
        setStatus(album.status ?? "RELEASED");
        setCoverImage(null);
    }, [open, album]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const title = albumName.trim();

        if (!title) {
            toast.error("Album name is required.");
            return;
        }

        try {
            await updateAlbum.mutateAsync({
                title,
                description: albumDescription.trim() || undefined,
                type: album?.type,
                status,
                coverImage: coverImage || undefined,
            });

            toast.success("Album updated successfully.");

            onEdited?.();
        } catch (error) {
            toast.error("Failed to update album.");
        }
    }

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm pb-16 sm:items-center sm:px-4 sm:py-6"
            role="presentation"
            onClick={onClose}
        >
            <div
                className="flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-background shadow-2xl sm:max-w-3xl sm:rounded-3xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-album-title"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="
                        flex shrink-0
                        items-start justify-between
                        gap-4
                        border-b border-border
                        px-5 py-4
                        sm:px-6 sm:py-5
                    "
                >
                    <div className="min-w-0">
                        <h2
                            id="edit-album-title"
                            className="text-lg font-semibold sm:text-xl"
                        >
                            Edit Album
                        </h2>

                        <p
                            className="
                                mt-1
                                text-xs
                                leading-5
                                text-muted-foreground
                                sm:text-sm
                            "
                        >
                            Update your album information and cover.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0"
                    >
                        <span className="text-xl leading-none">
                            ×
                        </span>
                    </Button>
                </div>

                {/* Scrollable content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div
                        className="
                            min-h-0
                            flex-1
                            overflow-y-auto
                            px-5 py-5
                            sm:px-6 sm:py-6
                        "
                    >
                        <div
                            className="
                                flex flex-col
                                gap-6
                                md:flex-row
                                md:items-start
                                md:gap-8
                            "
                        >
                            {/* Cover */}
                            <div
                                className="
                                    flex
                                    w-full
                                    flex-col
                                    items-center
                                    gap-3
                                    md:w-48
                                    md:shrink-0
                                "
                            >
                                <label
                                    className="
                                        self-start
                                        text-sm
                                        font-medium
                                        md:self-center
                                    "
                                >
                                    Cover Image
                                </label>

                                <div
                                    className="
                                        aspect-square
                                        w-44
                                        overflow-hidden
                                        rounded-xl
                                        bg-muted
                                        shadow-md
                                        sm:w-48
                                    "
                                >
                                    <img
                                        src={
                                            coverImage
                                                ? URL.createObjectURL(coverImage)
                                                : album?.coverImage ?? "/Logo512x512.png"
                                        }
                                        alt="Album cover preview"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="w-full"
                                    onChange={(event) => setCoverImage(event.target.files?.[0] ?? null)}
                                />

                                <p className="text-center text-xs text-muted-foreground" >
                                    JPG, PNG or WEBP
                                </p>
                            </div>

                            {/* Fields */}
                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-1
                                    flex-col
                                    gap-4
                                "
                            >
                                {/* Album name */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="album-name"
                                        className="text-sm font-medium"
                                    >
                                        Album Name
                                    </label>

                                    <Input
                                        id="album-name"
                                        value={albumName}
                                        onChange={(event) => setAlbumName(event.target.value)}
                                        placeholder="Enter album name"
                                        className="w-full"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="album-description"
                                        className="text-sm font-medium"
                                    >
                                        Description
                                    </label>

                                    <Textarea
                                        id="album-description"
                                        value={albumDescription}
                                        onChange={(event) => setAlbumDescription(event.target.value)}
                                        placeholder="Tell listeners about this album..."
                                        className="min-h-28 w-full resize-none"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="album-status"
                                        className="text-sm font-medium"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id="album-status"
                                        value={status}
                                        onChange={(event) => setStatus(event.target.value as AlbumStatus)}
                                        className="
                                            h-10
                                            w-full
                                            rounded-lg
                                            border
                                            border-border
                                            bg-background
                                            px-3
                                            text-sm
                                            outline-none
                                            transition-colors
                                            focus:border-primary
                                        "
                                    >
                                        <option value="PROCESSING">
                                            PROCESSING
                                        </option>
                                        <option value="RELEASED">
                                            RELEASED
                                        </option>
                                        <option value="BLOCKED">
                                            BLOCKED
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className="
                            flex
                            shrink-0
                            flex-col-reverse
                            gap-2
                            border-t border-border
                            bg-background
                            px-5 py-4
                            sm:flex-row
                            sm:justify-end
                            sm:gap-3
                            sm:px-6
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            loading={updateAlbum.isPending}
                            disabled={!albumName.trim()}
                            className="w-full sm:w-auto"
                        >
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}